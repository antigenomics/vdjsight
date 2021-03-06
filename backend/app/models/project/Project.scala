package models.project

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

case class ProjectsConfiguration(storagePath: String)

object ProjectsConfiguration {
  implicit val projectPermissionsDefaultConfigurationLoader: ConfigLoader[ProjectsConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    ProjectsConfiguration(
      storagePath = config.getString("storagePath")
    )
  }
}

// For future needs
case class ProjectLocations(folder: String)

case class Project(
  uuid: UUID,
  name: String,
  description: String,
  ownerID: UUID,
  folder: String,
  isDangling: Boolean
) {

  def locations: ProjectLocations = ProjectLocations(folder)

}

class ProjectTable(tag: Tag)(implicit up: UserProvider) extends Table[Project](tag, ProjectTable.TABLE_NAME) {
  def uuid        = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def name        = column[String]("name", O.Length(255))
  def description = column[String]("description")
  def ownerID     = column[UUID]("owner_id", O.SqlType("uuid"))
  def folder      = column[String]("folder", O.Unique)
  def isDangling  = column[Boolean]("is_dangling")

  def * = (uuid, name, description, ownerID, folder, isDangling) <> (Project.tupled, Project.unapply)

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
  case class ProjectProviderInitialized(configuration: ProjectsConfiguration) extends ProjectProviderEvent
  case class ProjectCreated(project: Project) extends ProjectProviderEvent
  case class ProjectUpdated(project: Project) extends ProjectProviderEvent
  case class ProjectDeleted(project: Project) extends ProjectProviderEvent
}

@Singleton
class ProjectProvider @Inject()(
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

  final private val configuration = conf.get[ProjectsConfiguration]("application.projects")

  import dbConfig.profile.api._

  final private val projects = TableQuery[ProjectTable]

  events.publish(ProjectProviderEvents.ProjectProviderInitialized(configuration))

  def table: TableQuery[ProjectTable] = projects

  def all: Future[Seq[Project]] = db.run(projects.result)

  def get(uuid: UUID): Future[Option[Project]] = db.run(projects.filter(_.uuid === uuid).result.headOption)

  def findForOwner(userID: UUID): Future[Seq[Project]] = db.run(projects.filter(_.ownerID === userID).result)

  def countForOwner(userID: UUID): Future[Int] = db.run(projects.filter(_.ownerID === userID).length.result)

  def getWithOwner(uuid: UUID): Future[Option[(Project, User)]] = db.run(projects.withOwner.filter(_._1.uuid === uuid).result.headOption)

  def create(
    userID: UUID,
    name: String                                         = "New project",
    description: String                                  = "",
    overrideConfiguration: Option[ProjectsConfiguration] = None
  ): Future[Project] = {
    val actions = userPermissionsProvider.table.filter(_.userID === userID).result.headOption flatMap {
        case Some(permissions) =>
          projects.filter(_.ownerID === userID).length.result flatMap { usersProjectsCount =>
            if (usersProjectsCount < permissions.maxProjectsCount) {
              val config    = overrideConfiguration.getOrElse(configuration)
              val projectID = UUID.randomUUID()
              val project = Project(
                uuid        = projectID,
                name        = name,
                description = description,
                ownerID     = userID,
                folder      = s"${config.storagePath}/$projectID",
                isDangling  = false
              )
              (projects += project) flatMap {
                case 0 => DBIO.failed(InternalServerErrorException("Cannot create Project instance in database", "Database error"))
                case _ => DBIO.successful(project)
              }
            } else {
              DBIO.failed(BadRequestException("Cannot create Project instance in database", "Too many projects"))
            }
          }
        case None => DBIO.failed(BadRequestException("Cannot create Project instance in database", "User does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { project =>
      events.publish(ProjectProviderEvents.ProjectCreated(project))
    }
  }

  def update(projectID: UUID, name: String, description: String): Future[Project] = {
    val actions = projects.filter(_.uuid === projectID).map(p => (p.name, p.description)).update((name, description)) flatMap {
        case 0 => DBIO.failed(new Exception("Cannot update Project instance in database: Project does not exist"))
        case _ =>
          projects.filter(_.uuid === projectID).result.headOption flatMap {
            case Some(project) => DBIO.successful(project)
            case None          => DBIO.failed(InternalServerErrorException("Cannot update Project instance in database", "Database error"))
          }
      }

    db.run(actions.transactionally) onSuccessSideEffect { project =>
      events.publish(ProjectProviderEvents.ProjectUpdated(project))
    }
  }

  def delete(uuid: UUID): Future[Project] = {
    val actions = projects.filter(_.uuid === uuid).result.headOption flatMap {
        case Some(project) =>
          projects.filter(_.uuid === uuid).delete flatMap {
            case 0 => DBIO.failed(InternalServerErrorException("Cannot delete Project instance in database", "Database error"))
            case _ => DBIO.successful(project)
          }
        case None => DBIO.failed(BadRequestException("Cannot delete Project instance in database", "Project does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { project =>
      events.publish(ProjectProviderEvents.ProjectDeleted(project))
    }
  }

}
