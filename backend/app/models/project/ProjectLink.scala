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

import scala.concurrent.{ExecutionContext, Future}
import scala.language.{higherKinds, implicitConversions, postfixOps}

case class ProjectLink(
  uuid: UUID,
  projectID: UUID,
  userID: UUID,
  isShared: Boolean,
  isUploadAllowed: Boolean,
  isDeleteAllowed: Boolean,
  isModificationAllowed: Boolean
)

class ProjectLinkTable(tag: Tag)(implicit pp: ProjectProvider, up: UserProvider) extends Table[ProjectLink](tag, ProjectLinkTable.TABLE_NAME) {
  def uuid                  = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def projectID             = column[UUID]("project_id", O.SqlType("uuid"))
  def userID                = column[UUID]("user_id", O.SqlType("uuid"))
  def isShared              = column[Boolean]("is_shared")
  def isUploadAllowed       = column[Boolean]("is_upload_allowed")
  def isDeleteAllowed       = column[Boolean]("is_delete_allowed")
  def isModificationAllowed = column[Boolean]("is_modification_allowed")

  def * = (uuid, projectID, userID, isShared, isUploadAllowed, isDeleteAllowed, isModificationAllowed) <> (ProjectLink.tupled, ProjectLink.unapply)

  def project = foreignKey("project_link_table_project_fk", projectID, pp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def user = foreignKey("project_link_table_project_fk", userID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def project_id_idx = index("project_link_table_project_id_idx", projectID, unique = false)

  def user_id_idx = index("project_link_table_user_id_idx", userID, unique = false)
}

object ProjectLinkTable {
  final val TABLE_NAME = "project_link"

  implicit class ProjectLinkTableExtension[C[_]](q: Query[ProjectLinkTable, ProjectLink, C]) {

    def withUser(implicit up: UserProvider): Query[(ProjectLinkTable, UserTable), (ProjectLink, User), C] = {
      q.join(up.table).on(_.userID === _.uuid)
    }

    def withProject(implicit pp: ProjectProvider): Query[(ProjectLinkTable, ProjectTable), (ProjectLink, Project), C] = {
      q.join(pp.table).on(_.projectID === _.uuid)
    }

  }

}

@Singleton
class ProjectLinkProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(
  implicit ec: ExecutionContext,
  pp: ProjectProvider,
  up: UserProvider
) extends HasDatabaseConfigProvider[JdbcProfile] {

  final private val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  final private val links = TableQuery[ProjectLinkTable]

  def table: TableQuery[ProjectLinkTable] = links

  def all: Future[Seq[ProjectLink]] = db.run(links.result)

  def get(uuid: UUID): Future[Option[ProjectLink]] = db.run(links.filter(_.uuid === uuid).result.headOption)

  def findForUser(userID: UUID): Future[Seq[ProjectLink]] = db.run(links.filter(_.userID === userID).result)

  def findForUserWithProject(userID: UUID): Future[Seq[(ProjectLink, Project)]] = db.run(links.withProject.filter(_._1.userID === userID).result)

  def getWithUser(uuid: UUID): Future[Option[(ProjectLink, User)]] = db.run(links.withUser.filter(_._1.uuid === uuid).result.headOption)

  def getWithProject(uuid: UUID): Future[Option[(ProjectLink, Project)]] = db.run(links.withProject.filter(_._1.uuid === uuid).result.headOption)

  def create(
    userID: UUID,
    projectID: UUID,
    isUploadAllowed: Boolean       = true,
    isDeleteAllowed: Boolean       = true,
    isModificationAllowed: Boolean = true
  ): Future[UUID] = {

    val checkUserExist    = up.table.filter(_.uuid === userID).result.headOption
    val checkProjectExist = pp.table.filter(_.uuid === projectID).result.headOption
    val checkLinkExist = links
      .filter(
        l =>
          l.userID                === userID &&
          l.projectID             === projectID &&
          l.isUploadAllowed       === isUploadAllowed &&
          l.isDeleteAllowed       === isDeleteAllowed &&
          l.isModificationAllowed === isModificationAllowed
      )
      .result
      .headOption

    db.run((checkUserExist zip checkProjectExist zip checkLinkExist).transactionally) flatMap {
      case ((Some(_), Some(_)), Some(link)) => Future.successful(link.uuid)
      case ((Some(user), Some(project)), None) =>
        throw new NotImplementedError("Not implemented")
      case ((None, _), _) => throw new RuntimeException("Cannot create VerificationToken instance in database: User does not exist")
      case ((_, None), _) => throw new RuntimeException("Cannot create VerificationToken instance in database: Project does not exist")
    }
  }

}
