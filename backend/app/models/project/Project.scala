package models.project

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import models.user.{User, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

import scala.concurrent.Future
import scala.language.higherKinds

case class Project(uuid: UUID, name: String, ownerID: UUID, folder: String, maxFileSize: Long, maxFilesCount: Long)

class ProjectTable(tag: Tag)(implicit up: UserProvider) extends Table[Project](tag, ProjectTable.TABLE_NAME) {

  def uuid          = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def name          = column[String]("name", O.Length(255))
  def ownerID       = column[UUID]("owner_id", O.SqlType("uuid"))
  def folder        = column[String]("folder", O.Length(510), O.Unique)
  def maxFileSize   = column[Long]("max_file_size")
  def maxFilesCount = column[Long]("max_files_count")

  def * = (uuid, name, ownerID, folder, maxFileSize, maxFilesCount) <> (Project.tupled, Project.unapply)

  def owner = foreignKey("project_table_owner_fk", ownerID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def owner_idx = index("project_table_owner_index", ownerID, unique = false)

}

object ProjectTable {
  final val TABLE_NAME = "project"

  implicit class ProjectTableExtensions[C[_]](q: Query[ProjectTable, Project, C]) {
    def withOwner(implicit up: UserProvider): Query[(ProjectTable, UserTable), (Project, User), C] = q.join(up.table).on(_.ownerID === _.uuid)
  }

}

@Singleton
class ProjectProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit up: UserProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val projects = TableQuery[ProjectTable]

  def table: TableQuery[ProjectTable] = projects

  def all: Future[Seq[Project]] = db.run(table.result)

  def get(uuid: UUID): Future[Option[Project]] = db.run(table.filter(_.uuid === uuid).result.headOption)
}
