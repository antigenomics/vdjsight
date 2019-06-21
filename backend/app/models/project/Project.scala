package models.project

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.user.{User, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.FutureUtils._

import scala.concurrent.{ExecutionContext, Future}
import scala.language.higherKinds

case class Project(uuid: UUID, name: String, description: String, ownerID: UUID)

class ProjectTable(tag: Tag)(implicit up: UserProvider) extends Table[Project](tag, ProjectTable.TABLE_NAME) {
  def uuid        = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def name        = column[String]("name", O.Length(255))
  def description = column[String]("description")
  def ownerID     = column[UUID]("owner_id", O.SqlType("uuid"))

  def * = (uuid, name, description, ownerID) <> (Project.tupled, Project.unapply)

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

trait ProjectProviderEvent extends AbstractEffectEvent

object ProjectProviderEvents {
  case class ProjectCreated(uuid: UUID) extends ProjectProviderEvent
  case class ProjectUpdated(uuid: UUID) extends ProjectProviderEvent
  case class ProjectDeleted(uuid: UUID) extends ProjectProviderEvent
}

@Singleton
class ProjectProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider, events: EffectsEventsStream)(
  implicit ec: ExecutionContext,
  up: UserProvider
) extends HasDatabaseConfigProvider[JdbcProfile] {

  final private val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  final private val projects = TableQuery[ProjectTable]

  def table: TableQuery[ProjectTable] = projects

  def all: Future[Seq[Project]] = db.run(projects.result)

  def get(uuid: UUID): Future[Option[Project]] = db.run(projects.filter(_.uuid === uuid).result.headOption)

  def findForOwner(userID: UUID): Future[Seq[Project]] = db.run(projects.filter(_.ownerID === userID).result)

  def getWithOwner(uuid: UUID): Future[Option[(Project, User)]] = db.run(projects.withOwner.filter(_._1.uuid === uuid).result.headOption)

  def create(userID: UUID, name: String = "New project", description: String = ""): Future[Project] = {
    up.get(userID).flatMap {
      case Some(user) =>
        val projectID = UUID.randomUUID()
        val project   = Project(projectID, name, description, user.uuid)
        db.run(projects += project) map {
          case 1 => project
          case _ => throw new RuntimeException("Cannot create Project instance in database: Internal error")
        } onSuccessSideEffect { _ =>
          events.publish(ProjectProviderEvents.ProjectCreated(projectID))
        }
      case None => throw new RuntimeException("Cannot create Project instance in database: User does not exist")
    }
  }

  def update(projectID: UUID, name: String, description: String): Future[Boolean] = {
    db.run(projects.filter(_.uuid === projectID).map(p => (p.name, p.description)).update((name, description))) map {
      case 1 => true
      case _ => throw new RuntimeException("Cannot create Project instance in database: Internal error")
    } onSuccessSideEffect { _ =>
      events.publish(ProjectProviderEvents.ProjectUpdated(projectID))
    }
  }

}
