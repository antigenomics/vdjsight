package models.sample

import java.util.UUID

import javax.inject.{Inject, Singleton}
import models.user.{User, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.H2Profile.api._
import slick.jdbc.JdbcProfile
import slick.lifted.Tag

import scala.language.higherKinds

case class SampleFile(uuid: UUID, ownerID: UUID, name: String, software: String)

class SampleFileTable(tag: Tag)(implicit up: UserProvider) extends Table[SampleFile](tag, SampleFileTable.TABLE_NAME) {
  def uuid     = column[UUID]("UUID", O.PrimaryKey, O.SqlType("UUID"))
  def ownerID  = column[UUID]("OWNER_ID", O.SqlType("UUID"))
  def name     = column[String]("NAME", O.Length(255))
  def software = column[String]("SOFTWARE", O.Length(64))

  def * = (uuid, ownerID, name, software) <> (SampleFile.tupled, SampleFile.unapply)

  def owner = foreignKey("SAMPLE_FILE_TABLE_OWNER_FK", ownerID, up.getTable)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def ownerID_idx = index("SAMPLE_FILE_TABLE_OWNER_ID_IDX", ownerID, unique = false)
}

object SampleFileTable {
  final val TABLE_NAME = "SAMPLE_FILE"

  implicit class SampleFileTableExtensions[C[_]](q: Query[SampleFileTable, SampleFile, C]) {
    def withOwner(implicit up: UserProvider): Query[(SampleFileTable, UserTable), (SampleFile, User), C] = q.join(up.getTable).on(_.ownerID === _.uuid)
  }

}

@Singleton
class SampleFileProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit up: UserProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val table = TableQuery[SampleFileTable]

  def getTable: TableQuery[SampleFileTable] = table
}
