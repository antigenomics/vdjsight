package models.cache

import java.sql.Timestamp
import java.time.Duration
import java.util.UUID

import akka.actor.{ActorSystem, Cancellable}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.cache
import models.sample.{SampleFile, SampleFileProvider, SampleFileTable}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.inject.ApplicationLifecycle
import play.api.{ConfigLoader, Configuration, Logging}
import play.db.NamedDatabase
import server.{BadRequestException, InternalServerErrorException}
import slick.ast.BaseTypedType
import slick.dbio.DBIOAction
import slick.jdbc.PostgresProfile.api._
import slick.jdbc.{JdbcProfile, JdbcType}
import slick.lifted.Tag
import utils.FutureUtils._
import utils.TimeUtils

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.language.{higherKinds, implicitConversions, postfixOps}
import scala.util.Failure

case class AnalysisCacheConfiguration(keep: Duration, interval: Duration, maxCount: Int)

object AnalysisCacheConfiguration {
  implicit val analysisCacheConfigurationLoader: ConfigLoader[AnalysisCacheConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    AnalysisCacheConfiguration(
      keep     = config.getDuration("keep"),
      interval = config.getDuration("interval"),
      maxCount = config.getInt("maxCount")
    )
  }
}

object AnalysisCacheExpiredAction extends Enumeration {
  type AnalysisCacheExpiredAction = Value

  val DELETE_FILE: cache.AnalysisCacheExpiredAction.Value = Value("delete_file")
  val NOTHING: cache.AnalysisCacheExpiredAction.Value     = Value("nothing")

  def convert(value: String): AnalysisCacheExpiredAction = {
    values.find(_.toString == value) match {
      case Some(v) => v
      case None    => throw new RuntimeException(s"Invalid reset method: $value")
    }
  }

  implicit def Method2String(value: AnalysisCacheExpiredAction): String = value.toString
  implicit def String2Method(value: String): AnalysisCacheExpiredAction = AnalysisCacheExpiredAction.convert(value)

  def analysisCacheExpiredActionToSqlType(action: AnalysisCacheExpiredAction.Value): String = action.toString

  implicit val AnalysisCacheExpiredActionColumnType
    : JdbcType[cache.AnalysisCacheExpiredAction.Value] with BaseTypedType[cache.AnalysisCacheExpiredAction.Value] =
    MappedColumnType.base[AnalysisCacheExpiredAction.Value, String](analysisCacheExpiredActionToSqlType, AnalysisCacheExpiredAction.withName)
}

case class AnalysisCache(
  uuid: UUID,
  sampleFileID: UUID,
  analysis: String,
  marker: String,
  cache: String,
  expiredAt: Timestamp,
  lastAccessedAt: Timestamp,
  expiredAction: AnalysisCacheExpiredAction.Value
)

class AnalysisCacheTable(tag: Tag)(implicit sampleFileProvider: SampleFileProvider) extends Table[AnalysisCache](tag, AnalysisCacheTable.TABLE_NAME) {
  def uuid           = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def sampleFileID   = column[UUID]("sample_file_id", O.SqlType("uuid"))
  def analysis       = column[String]("analysis")
  def marker         = column[String]("marker")
  def cache          = column[String]("cache")
  def expiredAt      = column[Timestamp]("expired_at")
  def lastAccessedAt = column[Timestamp]("last_accessed_at")
  def expiredAction  = column[AnalysisCacheExpiredAction.Value]("expired_action")

  def * = (uuid, sampleFileID, analysis, marker, cache, expiredAt, lastAccessedAt, expiredAction) <> (AnalysisCache.tupled, AnalysisCache.unapply)

  def sampleFile = foreignKey("sample_file_table_sample_id_fk", sampleFileID, sampleFileProvider.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def analysis_idx = index("analysis_cache_table_analysis_index", analysis, unique = false)

  def marker_idx = index("analysis_cache_table_marker_index", marker, unique = false)
}

object AnalysisCacheTable {
  final val TABLE_NAME = "analysis_cache"

  implicit class AnalysisCacheExtensions[C[_]](q: Query[AnalysisCacheTable, AnalysisCache, C]) {

    def withSample(implicit sampleFileProvider: SampleFileProvider): Query[(AnalysisCacheTable, SampleFileTable), (AnalysisCache, SampleFile), C] = {
      q.join(sampleFileProvider.table).on(_.sampleFileID === _.uuid)
    }
  }
}

trait AnalysisCacheProviderEvent extends AbstractEffectEvent

object AnalysisCacheProviderEvents {
  case class AnalysisCacheCreated(cache: AnalysisCache) extends AnalysisCacheProviderEvent
  case class AnalysisCacheTouch(cache: AnalysisCache) extends AnalysisCacheProviderEvent
  case class AnalysisCacheTouched(cache: AnalysisCache) extends AnalysisCacheProviderEvent
  case class AnalysisCacheDeleted(cache: AnalysisCache) extends AnalysisCacheProviderEvent
}

@Singleton
class AnalysisCacheProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  events: EffectsEventsStream
)(
  implicit
  ec: ExecutionContext,
  sampleFileProvider: SampleFileProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with Logging {

  final private val configuration = conf.get[AnalysisCacheConfiguration]("application.analysis.cache")

  import dbConfig.profile.api._

  final private val cacheEntries = TableQuery[AnalysisCacheTable]

  final private val expiredCacheDeleteScheduler: Option[Cancellable] = Option(!configuration.interval.isZero).collect {
    case true =>
      actorSystem.scheduler.schedule(configuration.interval.getSeconds seconds, configuration.interval.getSeconds seconds) {
        expired().map(_.map(_.uuid)).flatMap(delete) onComplete {
          case Failure(exception) => logger.warn("Cannot delete expired analysis cache", exception)
          case _                  =>
        }
      }
  }

  lifecycle.addStopHook { () =>
    Future.successful(expiredCacheDeleteScheduler.foreach(_.cancel()))
  }

  def table: TableQuery[AnalysisCacheTable] = cacheEntries

  def all: Future[Seq[AnalysisCache]] = db.run(cacheEntries.result)

  def touch(uuid: UUID): Unit = {
    val actions =
      cacheEntries
        .filter(_.uuid === uuid)
        .map(e => (e.expiredAt, e.lastAccessedAt))
        .update((TimeUtils.getExpiredAt(configuration.keep), TimeUtils.getCurrentTimestamp)) flatMap {
        case 0 => DBIO.failed(BadRequestException("Cannot touch AnalysisCache instance in database", "Cache does not exist"))
        case _ => cacheEntries.filter(_.uuid === uuid).result.headOption
      }
    db.run(actions.transactionally) onSuccessSideEffect {
      case Some(c) => events.publish(AnalysisCacheProviderEvents.AnalysisCacheTouched(c))
      case None    =>
    }
  }

  def get(uuid: UUID): Future[Option[AnalysisCache]] = db.run(cacheEntries.filter(_.uuid === uuid).result.headOption)

  def getAndTouch(uuid: UUID): Future[Option[AnalysisCache]] = {
    get(uuid) onSuccessSideEffect {
      case Some(c) => events.publish(AnalysisCacheProviderEvents.AnalysisCacheTouch(c))
      case None    =>
    }
  }

  def findForSampleFile(sampleFileID: UUID): Future[Seq[AnalysisCache]] = {
    db.run(cacheEntries.filter(_.sampleFileID === sampleFileID).result)
  }

  def getWithSampleFile(uuid: UUID): Future[Seq[(AnalysisCache, SampleFile)]] = {
    db.run(cacheEntries.withSample.filter(_._1.uuid === uuid).result)
  }

  def findForSampleForAnalysis(sampleFileID: UUID, analysis: String): Future[Option[AnalysisCache]] = {
    db.run(cacheEntries.filter(e => e.sampleFileID === sampleFileID && e.analysis === analysis).result.headOption)
  }

  def findForSampleForAnalysisWithMarker(sampleFileID: UUID, analysis: String, marker: String): Future[Option[AnalysisCache]] = {
    db.run(cacheEntries.filter(e => e.sampleFileID === sampleFileID && e.analysis === analysis && e.marker === marker).result.headOption)
  }

  def findForSampleForAnalysisWithMarkerAndTouch(sampleFileID: UUID, analysis: String, marker: String): Future[Option[AnalysisCache]] = {
    findForSampleForAnalysisWithMarker(sampleFileID, analysis, marker) onSuccessSideEffect {
      case Some(c) => events.publish(AnalysisCacheProviderEvents.AnalysisCacheTouch(c))
      case None    =>
    }
  }

  def create(
    sampleFileUUID: UUID,
    analysis: String,
    marker: String,
    action: AnalysisCacheExpiredAction.Value,
    cache: String,
    overrideConfiguration: Option[AnalysisCacheConfiguration] = None
  ): Future[AnalysisCache] = {
    val actions = sampleFileProvider.table.filter(_.uuid === sampleFileUUID).result.headOption flatMap {
        case Some(sampleFile) =>
          cacheEntries.filter(e => e.sampleFileID === sampleFileUUID && e.analysis === analysis).result flatMap { existingCacheEntriesForAnalysis =>
            val config = overrideConfiguration.getOrElse(configuration)

            val deleteExtraCacheEntries = if (config.maxCount > 0 && existingCacheEntriesForAnalysis.size >= config.maxCount) {
              delete(existingCacheEntriesForAnalysis.sortWith((l, r) => l.expiredAt.before(r.expiredAt)).head.uuid).map(_ => 1)
            } else {
              Future(1)
            }

            DBIOAction.from(deleteExtraCacheEntries) flatMap {
              case 0 => DBIO.failed(InternalServerErrorException("Cannot create AnalysisCache instance in database", "Extra cache entries check failed"))
              case _ =>
                val cacheID = UUID.randomUUID()
                val cacheEntity = AnalysisCache(
                  uuid           = cacheID,
                  sampleFileID   = sampleFile.uuid,
                  analysis       = analysis,
                  marker         = marker,
                  cache          = cache,
                  expiredAt      = TimeUtils.getExpiredAt(config.keep),
                  lastAccessedAt = TimeUtils.getCurrentTimestamp,
                  expiredAction  = action
                )
                (cacheEntries += cacheEntity) flatMap {
                  case 0 => DBIO.failed(InternalServerErrorException("Cannot create AnalysisCache instance in database", "Database error"))
                  case 1 => DBIO.successful(cacheEntity)
                }
            }
          }
        case None =>
          DBIO.failed(BadRequestException("Cannot create AnalysisCache instance in database", "Sample does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { cache =>
      events.publish(AnalysisCacheProviderEvents.AnalysisCacheCreated(cache))
    }
  }

  def delete(uuid: UUID): Future[AnalysisCache] = {
    val actions = cacheEntries.filter(_.uuid === uuid).result.headOption flatMap {
        case Some(cache) =>
          cacheEntries.filter(_.uuid === uuid).delete flatMap {
            case 0 => DBIO.failed(InternalServerErrorException("Cannot delete AnalysisCache instance in database", "Database error"))
            case _ => DBIO.successful(cache)
          }
        case None => DBIO.failed(BadRequestException("Cannot delete AnalysisCache instance in database", "Cache does not exist"))
      }
    db.run(actions.transactionally) onSuccessSideEffect { cache =>
      events.publish(AnalysisCacheProviderEvents.AnalysisCacheDeleted(cache))
    }
  }

  def delete(uuidSet: Seq[UUID]): Future[Seq[AnalysisCache]] = Future.sequence(uuidSet.map(u => delete(u)))

  def deleteForSampleFile(sampleFileID: UUID): Future[Seq[AnalysisCache]] = findForSampleFile(sampleFileID).map(_.map(_.uuid)).flatMap(delete)

  def expired(date: Timestamp = TimeUtils.getCurrentTimestamp): Future[Seq[AnalysisCache]] = db.run(cacheEntries.filter(_.expiredAt < date).result)

}
