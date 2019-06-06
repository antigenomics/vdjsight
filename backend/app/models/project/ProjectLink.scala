package models.project

import java.util.UUID

import javax.inject.{Inject, Singleton}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.H2Profile.api._
import slick.jdbc.JdbcProfile
import slick.lifted.Tag

case class ProjectLink(uuid: UUID, projectID: UUID, isShared: Boolean, isUploadAllowed: Boolean, isDeleteAllowed: Boolean, isModificationAllowed: Boolean)

class ProjectLinkTable(tag: Tag)(implicit pp: ProjectProvider) extends Table[ProjectLink](tag, ProjectLinkTable.TABLE_NAME) {
  def uuid                  = column[UUID]("UUID", O.PrimaryKey, O.SqlType("UUID"))
  def projectID             = column[UUID]("PROJECT_ID", O.SqlType("UUID"))
  def isShared              = column[Boolean]("IS_SHARED")
  def isUploadAllowed       = column[Boolean]("IS_UPLOAD_ALLOWED")
  def isDeleteAllowed       = column[Boolean]("IS_DELETE_ALLOWED")
  def isModificationAllowed = column[Boolean]("IS_MODIFICATION_ALLOWED")

  def * = (uuid, projectID, isShared, isUploadAllowed, isDeleteAllowed, isModificationAllowed) <> (ProjectLink.tupled, ProjectLink.unapply)

  def project = foreignKey("PROJECT_LINK_TABLE_PROJECT_FK", projectID, pp.getTable)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def projectID_idx = index("PROJECT_LINK_TABLE_PROJECT_ID_IDX", projectID, unique = false)
}

object ProjectLinkTable {
  final val TABLE_NAME = "PROJECT_LINK"
}

@Singleton
class ProjectLinkProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit pp: ProjectProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val table = TableQuery[ProjectLinkTable]

  def getTable: TableQuery[ProjectLinkTable] = table
}
