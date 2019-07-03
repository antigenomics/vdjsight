package models.sample

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.user.{User, UserProvider, UserTable}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.{ConfigLoader, Configuration, Logging}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

import scala.concurrent.{ExecutionContext, Future}
import scala.language.higherKinds

case class SamplesConfiguration(storagePath: String)

object SamplesConfiguration {
  implicit val samplesConfigurationLoader: ConfigLoader[SamplesConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    SamplesConfiguration(
      storagePath = config.getString("storagePath")
    )
  }
}

case class SampleFile(uuid: UUID, ownerID: UUID, name: String, software: String, folder: String)

class SampleFileTable(tag: Tag)(implicit up: UserProvider) extends Table[SampleFile](tag, SampleFileTable.TABLE_NAME) {
  def uuid     = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def ownerID  = column[UUID]("owner_id", O.SqlType("uuid"))
  def name     = column[String]("name", O.Length(255))
  def software = column[String]("software", O.Length(64))
  def folder   = column[String]("folder", O.Unique)

  def * = (uuid, ownerID, name, software, folder) <> (SampleFile.tupled, SampleFile.unapply)

  def owner = foreignKey("sample_file_table_owner_fk", ownerID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def owner_id_idx = index("sample_file_table_owner_id_idx", ownerID, unique = false)
}

object SampleFileTable {
  final val TABLE_NAME = "sample_file"

  implicit class SampleFileTableExtensions[C[_]](q: Query[SampleFileTable, SampleFile, C]) {
    def withOwner(implicit up: UserProvider): Query[(SampleFileTable, UserTable), (SampleFile, User), C] = q.join(up.table).on(_.ownerID === _.uuid)
  }

}

trait SampleFileProviderEvent extends AbstractEffectEvent

object SampleFileProviderEvents {
  case class SampleFileProviderInitialized(configuration: SamplesConfiguration) extends SampleFileProviderEvent
  case class SampleFileCreated(sample: SampleFile) extends SampleFileProviderEvent
  case class SampleFileUpdated(sampleID: UUID) extends SampleFileProviderEvent
  case class SampleFileDeleted(sample: SampleFile) extends SampleFileProviderEvent
}

@Singleton
class SampleFileProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  events: EffectsEventsStream
)(
  implicit ec: ExecutionContext,
  up: UserProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with Logging {

  import dbConfig.profile.api._

  final private val samples = TableQuery[SampleFileTable]

  def table: TableQuery[SampleFileTable] = samples

  def all: Future[Seq[SampleFile]] = db.run(samples.result)

  def get(uuid: UUID): Future[Option[SampleFile]] = db.run(samples.filter(_.uuid === uuid).result.headOption)

  def findForOwner(userID: UUID): Future[Seq[SampleFile]] = db.run(samples.filter(_.ownerID === userID).result)

  def getWithOwner(uuid: UUID): Future[Option[(SampleFile, User)]] = db.run(samples.withOwner.filter(_._1.uuid === uuid).result.headOption)

  def create(userID: UUID, name: String, overrideConfiguration: Option[SamplesConfiguration] = None): Future[SampleFile] = {
    Future(null)
  }
}
