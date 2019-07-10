package models.sample

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.user.{User, UserPermissionsProvider, UserProvider, UserTable}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.{ConfigLoader, Configuration, Logging}
import play.db.NamedDatabase
import server.{BadRequestException, InternalServerErrorException}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.FutureUtils._

import scala.concurrent.{ExecutionContext, Future}
import scala.language.higherKinds

case class SampleFilesConfiguration(storagePath: String)

object SampleFilesConfiguration {
  implicit val samplesConfigurationLoader: ConfigLoader[SampleFilesConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    SampleFilesConfiguration(
      storagePath = config.getString("storagePath")
    )
  }
}

case class SampleFile(uuid: UUID, ownerID: UUID, name: String, software: String, size: Long, hash: String, folder: String, isDangling: Boolean)

class SampleFileTable(tag: Tag)(implicit userProvider: UserProvider) extends Table[SampleFile](tag, SampleFileTable.TABLE_NAME) {
  def uuid       = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def ownerID    = column[UUID]("owner_id", O.SqlType("uuid"))
  def name       = column[String]("name", O.Length(255))
  def software   = column[String]("software", O.Length(64))
  def size       = column[Long]("size")
  def hash       = column[String]("hash")
  def folder     = column[String]("folder", O.Unique)
  def isDangling = column[Boolean]("is_dangling")

  def * = (uuid, ownerID, name, software, size, hash, folder, isDangling) <> (SampleFile.tupled, SampleFile.unapply)

  def owner = foreignKey("sample_file_table_owner_fk", ownerID, userProvider.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def owner_id_idx = index("sample_file_table_owner_id_idx", ownerID, unique = false)
}

object SampleFileTable {
  final val TABLE_NAME = "sample_file"

  implicit class SampleFileTableExtensions[C[_]](q: Query[SampleFileTable, SampleFile, C]) {

    def withOwner(implicit userProvider: UserProvider): Query[(SampleFileTable, UserTable), (SampleFile, User), C] = {
      q.join(userProvider.table).on(_.ownerID === _.uuid)
    }
  }

}

trait SampleFileProviderEvent extends AbstractEffectEvent

object SampleFileProviderEvents {
  case class SampleFileProviderInitialized(configuration: SampleFilesConfiguration) extends SampleFileProviderEvent
  case class SampleFileCreated(sample: SampleFile) extends SampleFileProviderEvent
  case class SampleFileUpdated(sample: SampleFile) extends SampleFileProviderEvent
  case class SampleFileDeleted(sample: SampleFile) extends SampleFileProviderEvent
}

@Singleton
class SampleFileProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  events: EffectsEventsStream
)(
  implicit
  ec: ExecutionContext,
  userProvider: UserProvider,
  userPermissionsProvider: UserPermissionsProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with Logging {

  final private val configuration = conf.get[SampleFilesConfiguration]("application.samples")

  import dbConfig.profile.api._

  final private val samples = TableQuery[SampleFileTable]

  def table: TableQuery[SampleFileTable] = samples

  def all: Future[Seq[SampleFile]] = db.run(samples.result)

  def get(uuid: UUID): Future[Option[SampleFile]] = db.run(samples.filter(_.uuid === uuid).result.headOption)

  def findForOwner(userID: UUID): Future[Seq[SampleFile]] = db.run(samples.filter(_.ownerID === userID).result)

  def getWithOwner(uuid: UUID): Future[Option[(SampleFile, User)]] = db.run(samples.withOwner.filter(_._1.uuid === uuid).result.headOption)

  def create(
    userID: UUID,
    name: String,
    software: String,
    size: Long,
    hash: String,
    overrideConfiguration: Option[SampleFilesConfiguration] = None
  ): Future[SampleFile] = {
    val actions = userPermissionsProvider.table.filter(_.uuid === userID).result.headOption flatMap {
        case Some(permissions) =>
          samples.filter(_.ownerID === userID).length.result flatMap { usersSamplesCount =>
            if (usersSamplesCount >= permissions.maxSamplesCount) {
              DBIO.failed(BadRequestException("Cannot create SampleFile instance in database", "Too many samples"))
            } else if (size >= permissions.maxSampleSize) {
              DBIO.failed(BadRequestException("Cannot create SampleFile instance in database", "Sample size is too big"))
            } else {
              val config   = overrideConfiguration.getOrElse(configuration)
              val sampleID = UUID.randomUUID()
              val sample = SampleFile(
                uuid       = sampleID,
                ownerID    = userID,
                name       = name,
                software   = software,
                size       = size,
                hash       = hash,
                folder     = s"${config.storagePath}/$sampleID",
                isDangling = false
              )
              (samples += sample) flatMap {
                case 0 => DBIO.failed(InternalServerErrorException("Cannot create SampleFile instance in database", "Database error"))
                case _ => DBIO.successful(sample)
              }
            }
          }
        case None => DBIO.failed(BadRequestException("Cannot create SampleFile instance in database", "User does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { sample =>
      events.publish(SampleFileProviderEvents.SampleFileCreated(sample))
    }
  }

  def update(sampleID: UUID, name: String, software: String): Future[SampleFile] = {
    val actions = samples.filter(_.uuid === sampleID).map(s => (s.name, s.software)).update((name, software)) flatMap {
        case 0 => DBIO.failed(BadRequestException("Cannot update SampleFile instance in database", "Project does not exist"))
        case _ =>
          samples.filter(_.uuid === sampleID).result.headOption flatMap {
            case Some(sample) => DBIO.successful(sample)
            case None         => DBIO.failed(InternalServerErrorException("Cannot update SampleFile instance in database", "Database error"))
          }
      }

    db.run(actions.transactionally) onSuccessSideEffect { sample =>
      events.publish(SampleFileProviderEvents.SampleFileUpdated(sample))
    }
  }

  def delete(uuid: UUID): Future[SampleFile] = {
    val actions = samples.filter(_.uuid === uuid).result.headOption flatMap {
        case Some(sample) =>
          samples.filter(_.uuid === uuid).delete flatMap {
            case 0 => DBIO.failed(InternalServerErrorException("Cannot delete SampleFile instance in database", "Database error"))
            case _ => DBIO.successful(sample)
          }
        case None => DBIO.failed(BadRequestException("Cannot delete SampleFile instance in database", "Project does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { sample =>
      events.publish(SampleFileProviderEvents.SampleFileDeleted(sample))
    }
  }
}
