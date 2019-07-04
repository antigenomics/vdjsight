package models.sample

import java.sql.Timestamp
import java.time.Duration
import java.util.UUID

import akka.actor.{ActorSystem, Cancellable}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.project.{Project, ProjectProvider, ProjectTable}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.inject.ApplicationLifecycle
import play.api.{ConfigLoader, Configuration, Logging}
import play.db.NamedDatabase
import server.{BadRequestException, InternalServerErrorException}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.FutureUtils._
import utils.TimeUtils

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.language.{higherKinds, implicitConversions, postfixOps}
import scala.util.Failure

case class SampleFileLinkDeleteConfiguration(keep: Duration, interval: Duration)

object SampleFileLinkDeleteConfiguration {
  implicit val sampleFileLinkDeleteConfigurationLoader: ConfigLoader[SampleFileLinkDeleteConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    SampleFileLinkDeleteConfiguration(
      keep     = config.getDuration("keep"),
      interval = config.getDuration("interval")
    )
  }
}

case class SampleFileLinksConfiguration(delete: SampleFileLinkDeleteConfiguration)

object SampleFileLinksConfiguration {
  implicit val sampleFileLinksConfigurationLoader: ConfigLoader[SampleFileLinksConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    SampleFileLinksConfiguration(
      delete = SampleFileLinkDeleteConfiguration.sampleFileLinkDeleteConfigurationLoader.load(config, "delete")
    )
  }
}

case class SampleFileLink(uuid: UUID, sampleID: UUID, projectID: UUID, deleteOn: Option[Timestamp])

class SampleFileLinkTable(tag: Tag)(implicit sfp: SampleFileProvider, pp: ProjectProvider) extends Table[SampleFileLink](tag, SampleFileLinkTable.TABLE_NAME) {
  def uuid      = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def sampleID  = column[UUID]("sample_id", O.SqlType("uuid"))
  def projectID = column[UUID]("project_id", O.SqlType("uuid"))
  def deleteOn  = column[Option[Timestamp]]("delete_on")

  def * = (uuid, sampleID, projectID, deleteOn) <> (SampleFileLink.tupled, SampleFileLink.unapply)

  def sample = foreignKey("sample_file_link_table_sample_fk", sampleID, sfp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def project_link = foreignKey("sample_file_link_table_project_fk", projectID, pp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def sample_id_idx = index("sample_file_link_table_sample_id_idx", sampleID, unique = false)

  def project_link_id_idx = index("sample_file_link_table_project_id_idx", projectID, unique = false)
}

object SampleFileLinkTable {
  final val TABLE_NAME = "sample_file_link"

  implicit class SampleFileLinkTableExtension[C[_]](q: Query[SampleFileLinkTable, SampleFileLink, C]) {

    def withSample(implicit sfp: SampleFileProvider): Query[(SampleFileLinkTable, SampleFileTable), (SampleFileLink, SampleFile), C] = {
      q.join(sfp.table).on(_.sampleID === _.uuid)
    }

    def withProject(implicit pp: ProjectProvider): Query[(SampleFileLinkTable, ProjectTable), (SampleFileLink, Project), C] = {
      q.join(pp.table).on(_.projectID === _.uuid)
    }
  }
}

trait SampleFileLinkProviderEvent extends AbstractEffectEvent

object SampleFileLinkProviderEvents {
  case class SampleFileLinkProviderInitialized(configuration: SampleFileLinksConfiguration) extends SampleFileLinkProviderEvent
  case class SampleFileLinkCreated(link: SampleFileLink) extends SampleFileLinkProviderEvent
  case class SampleFileLinkDeleteScheduled(linkID: UUID) extends SampleFileLinkProviderEvent
  case class SampleFileLinkDeleteCancelled(linkID: UUID) extends SampleFileLinkProviderEvent
  case class SampleFileLinkDeleted(link: SampleFileLink) extends SampleFileLinkProviderEvent
}

@Singleton
class SampleFileLinkProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  events: EffectsEventsStream
)(
  implicit
  ec: ExecutionContext,
  sfp: SampleFileProvider,
  pp: ProjectProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with Logging {

  final private val configuration = conf.get[SampleFileLinksConfiguration]("application.samples.links")

  import dbConfig.profile.api._

  final private val links = TableQuery[SampleFileLinkTable]

  events.publish(SampleFileLinkProviderEvents.SampleFileLinkProviderInitialized(configuration))

  final private val expiredLinksDeleteScheduler: Option[Cancellable] = Option(!configuration.delete.interval.isZero).collect {
    case true =>
      actorSystem.scheduler.schedule(10 seconds, configuration.delete.interval.getSeconds seconds) {
        expired().map(_.map(_.uuid)).flatMap(delete) onComplete {
          case Failure(exception) => logger.warn("Cannot delete expired sample links", exception)
          case _                  =>
        }
      }
  }

  lifecycle.addStopHook { () =>
    Future.successful(expiredLinksDeleteScheduler.foreach(_.cancel()))
  }

  def table: TableQuery[SampleFileLinkTable] = links

  def all: Future[Seq[SampleFileLink]] = db.run(links.result)

  def get(uuid: UUID): Future[Option[SampleFileLink]] = db.run(links.filter(_.uuid === uuid).result.headOption)

  def findForSample(sampleID: UUID): Future[Seq[SampleFileLink]] = db.run(links.filter(_.sampleID === sampleID).result)

  def findForSampleWithProject(sampleID: UUID): Future[Seq[(SampleFileLink, Project)]] = db.run(links.withProject.filter(_._1.sampleID === sampleID).result)

  def findForProject(projectID: UUID): Future[Seq[SampleFileLink]] = db.run(links.filter(_.projectID === projectID).result)

  def findForProjectWithSample(projectID: UUID): Future[Seq[(SampleFileLink, SampleFile)]] =
    db.run(links.withSample.filter(_._1.projectID === projectID).result)

  def getWithSample(uuid: UUID): Future[Option[(SampleFileLink, SampleFile)]] = db.run(links.withSample.filter(_._1.uuid === uuid).result.headOption)

  def getWithProject(uuid: UUID): Future[Option[(SampleFileLink, Project)]] = db.run(links.withProject.filter(_._1.uuid === uuid).result.headOption)

  def create(sampleID: UUID, projectID: UUID): Future[SampleFileLink] = {
    val actions = sfp.table.filter(_.uuid === sampleID).result.headOption flatMap {
        case Some(_) =>
          pp.table.filter(_.uuid === projectID).result.headOption flatMap {
            case Some(_) =>
              links.filter(link => link.sampleID === sampleID && link.projectID === projectID).result.headOption flatMap {
                case Some(link) => DBIO.successful(link)
                case None =>
                  val linkID = UUID.randomUUID()
                  val link = SampleFileLink(
                    uuid      = linkID,
                    sampleID  = sampleID,
                    projectID = projectID,
                    deleteOn  = None
                  )
                  (links += link) flatMap {
                    case 0 => DBIO.failed(InternalServerErrorException("Cannot create SampleFileLink instance in database: Database error"))
                    case _ =>
                      events.publish(SampleFileLinkProviderEvents.SampleFileLinkCreated(link))
                      DBIO.successful(link)
                  }
              }
            case None => DBIO.failed(BadRequestException("Cannot create SampleFileLink instance in database: Project does not exist"))
          }
        case None => DBIO.failed(BadRequestException("Cannot create SampleFileLink instance in database: SampleFile does not exist"))
      }

    db.run(actions.transactionally)
  }

  def scheduleDelete(uuid: UUID): Future[Boolean] = {
    val actions = links.withSample.filter(_._1.uuid === uuid).result.headOption flatMap {
        case Some((link, sample)) =>
          links.filter(_.uuid === link.uuid).map(_.deleteOn).update(Some(TimeUtils.getExpiredAt(configuration.delete.keep))) flatMap { u =>
            links.filter(_.sampleID === sample.uuid).result flatMap { ls =>
              ls.forall(_.deleteOn.nonEmpty) match {
                case true  => sfp.table.filter(_.uuid === link.sampleID).map(_.isDangling).update(true).map(_ + u)
                case false => DBIO.successful(u)
              }
            }
          }
        case None => DBIO.failed(BadRequestException("Cannot schedule SampleFileLink instance delete: Link does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { _ =>
      events.publish(SampleFileLinkProviderEvents.SampleFileLinkDeleteScheduled(uuid))
    } map {
      case 0 => false
      case _ => true
    }
  }

  def cancelScheduledDelete(uuid: UUID): Future[Boolean] = {
    val actions = links.withSample.filter(_._1.uuid === uuid).result.headOption flatMap {
        case Some((link, sample)) =>
          links.filter(_.uuid === link.uuid).map(_.deleteOn).update(None) flatMap { u =>
            sample.isDangling match {
              case true  => sfp.table.filter(_.uuid === link.sampleID).map(_.isDangling).update(false).map(_ + u)
              case false => DBIO.successful(u)
            }
          }
        case None => DBIO.failed(BadRequestException("Cannot cancel scheduled SampleFileLink instance deletion: Link does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { _ =>
      events.publish(SampleFileLinkProviderEvents.SampleFileLinkDeleteCancelled(uuid))
    } map {
      case 0 => false
      case _ => true
    }
  }

  def delete(uuid: UUID): Future[Boolean] = {
    val actions = links.filter(_.uuid === uuid).result.headOption flatMap {
        case Some(link) => links.filter(_.uuid === uuid).delete map (_ => link)
        case None       => DBIO.failed(BadRequestException("Cannot delete SampleFileLink instance: Link does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { link =>
      events.publish(SampleFileLinkProviderEvents.SampleFileLinkDeleted(link))
    } map (_ => true)
  }

  def delete(seq: Seq[UUID]): Future[Boolean] = Future.sequence(seq.map(delete)).map(_.forall(_ == true))

  def expired(date: Timestamp = TimeUtils.getCurrentTimestamp): Future[Seq[SampleFileLink]] =
    db.run(links.filter(l => l.deleteOn.nonEmpty && l.deleteOn < date).result)

}
