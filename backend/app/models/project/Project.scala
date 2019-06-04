package models.project

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

case class Project(uuid: UUID, name: String, ownerID: UUID, folder: String, maxFileSize: Long, maxFilesCount: Long)

class ProjectTable(tag: Tag)(implicit up: UserProvider) extends Table[Project](tag, ProjectTable.TABLE_NAME) {

  def uuid = column[UUID]("UUID", O.PrimaryKey, O.SqlType("UUID"))
  def name = column[String]("NAME", O.Length(255))
  def ownerID = column[UUID]("OWNER_ID", O.SqlType("UUID"))
  def folder = column[String]("FOLDER", O.Length(510), O.Unique)
  def maxFileSize = column[Long]("MAX_FILE_SIZE")
  def maxFilesCount = column[Long]("MAX_FILES_COUNT")

  def * = (uuid, name, ownerID, folder, maxFileSize, maxFilesCount) <> (Project.tupled, Project.unapply)

  def owner = foreignKey("OWNER_FK", ownerID, up.getTable)(_.uuid,
    onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Restrict
  )

  def owner_idx = index("OWNER_INDEX", ownerID, unique = false)

}

object ProjectTable {
  final val TABLE_NAME = "PROJECT"

  implicit class ProjectTableExtensions[C[_]](q: Query[ProjectTable, Project, C]) {
    def withOwner(implicit up: UserProvider): Query[(ProjectTable, UserTable), (Project, User), C] = q.join(up.getTable).on(_.ownerID === _.uuid)
  }
}

@Singleton
class ProjectProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit up: UserProvider)
  extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val table = TableQuery[ProjectTable]

  def getTable: TableQuery[ProjectTable] = table
}


