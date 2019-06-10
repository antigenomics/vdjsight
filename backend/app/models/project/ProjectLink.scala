package models.project

import java.util.UUID

import javax.inject.{Inject, Singleton}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

case class ProjectLink(uuid: UUID, projectID: UUID, isShared: Boolean, isUploadAllowed: Boolean, isDeleteAllowed: Boolean, isModificationAllowed: Boolean)

class ProjectLinkTable(tag: Tag)(implicit pp: ProjectProvider) extends Table[ProjectLink](tag, ProjectLinkTable.TABLE_NAME) {
  def uuid                  = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def projectID             = column[UUID]("project_id", O.SqlType("uuid"))
  def isShared              = column[Boolean]("is_shared")
  def isUploadAllowed       = column[Boolean]("is_upload_allowed")
  def isDeleteAllowed       = column[Boolean]("is_delete_allowed")
  def isModificationAllowed = column[Boolean]("is_modification_allowed")

  def * = (uuid, projectID, isShared, isUploadAllowed, isDeleteAllowed, isModificationAllowed) <> (ProjectLink.tupled, ProjectLink.unapply)

  def project = foreignKey("project_link_table_project_fk", projectID, pp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def project_id_idx = index("project_link_table_project_id_idx", projectID, unique = false)
}

object ProjectLinkTable {
  final val TABLE_NAME = "project_link"
}

@Singleton
class ProjectLinkProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit pp: ProjectProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val links = TableQuery[ProjectLinkTable]

  def table: TableQuery[ProjectLinkTable] = links
}
