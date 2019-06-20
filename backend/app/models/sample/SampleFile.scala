package models.sample

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import models.user.{User, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

import scala.language.higherKinds

case class SampleFile(uuid: UUID, ownerID: UUID, name: String, software: String)

class SampleFileTable(tag: Tag)(implicit up: UserProvider) extends Table[SampleFile](tag, SampleFileTable.TABLE_NAME) {
  def uuid     = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def ownerID  = column[UUID]("owner_id", O.SqlType("uuid"))
  def name     = column[String]("name", O.Length(255))
  def software = column[String]("software", O.Length(64))

  def * = (uuid, ownerID, name, software) <> (SampleFile.tupled, SampleFile.unapply)

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

@Singleton
class SampleFileProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit up: UserProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  final private val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  final private val samples = TableQuery[SampleFileTable]

  def table: TableQuery[SampleFileTable] = samples
}
