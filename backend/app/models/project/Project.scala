package models.project

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.user.{User, UserPermissionsProvider, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.{ConfigLoader, Configuration}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.FutureUtils._

import scala.concurrent.{ExecutionContext, Future}
import scala.language.higherKinds

case class ProjectPermissionsConfiguration(storagePath: String, maxSamplesCount: Long)

object ProjectPermissionsConfiguration {
  implicit val projectPermissionsDefaultConfigurationLoader: ConfigLoader[ProjectPermissionsConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    ProjectPermissionsConfiguration(
      storagePath     = config.getString("storagePath"),
      maxSamplesCount = config.getLong("maxSamplesCount")
    )
  }
}

case class Project(uuid: UUID, name: String, description: String, ownerID: UUID, folder: String, maxSampleCount: Long)

class ProjectTable(tag: Tag)(implicit up: UserProvider) extends Table[Project](tag, ProjectTable.TABLE_NAME) {
  def uuid            = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def name            = column[String]("name", O.Length(255))
  def description     = column[String]("description")
  def ownerID         = column[UUID]("owner_id", O.SqlType("uuid"))
  def folder          = column[String]("folder", O.Unique)
  def maxSamplesCount = column[Long]("max_samples_count")

  def * = (uuid, name, description, ownerID, folder, maxSamplesCount) <> (Project.tupled, Project.unapply)

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
  case class ProjectCreated(project: Project) extends ProjectProviderEvent
  case class ProjectUpdated(projectId: UUID) extends ProjectProviderEvent
  case class ProjectDeleted(project: Project) extends ProjectProviderEvent
}

@Singleton
class ProjectProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  events: EffectsEventsStream
)(
  implicit ec: ExecutionContext,
  up: UserProvider,
  upp: UserPermissionsProvider
) extends HasDatabaseConfigProvider[JdbcProfile] {

  final private val logger               = LoggerFactory.getLogger(this.getClass)
  final private val defaultConfiguration = conf.get[ProjectPermissionsConfiguration]("application.projects.permissions")

  import dbConfig.profile.api._

  final private val projects = TableQuery[ProjectTable]

  def table: TableQuery[ProjectTable] = projects

  def all: Future[Seq[Project]] = db.run(projects.result)

  def get(uuid: UUID): Future[Option[Project]] = db.run(projects.filter(_.uuid === uuid).result.headOption)

  def findForOwner(userID: UUID): Future[Seq[Project]] = db.run(projects.filter(_.ownerID === userID).result)

  def getWithOwner(uuid: UUID): Future[Option[(Project, User)]] = db.run(projects.withOwner.filter(_._1.uuid === uuid).result.headOption)

  def create(
    userID: UUID,
    name: String                                           = "New project",
    description: String                                    = "",
    configuration: Option[ProjectPermissionsConfiguration] = None
  ): Future[Project] = {
    up.get(userID).flatMap {
      case Some(user) =>
        val projectID = UUID.randomUUID()
        val config    = configuration.getOrElse(defaultConfiguration)

        val maxSamplesCountFuture = config.maxSamplesCount match {
          case 0 => upp.findForUser(userID).map(_.map(_.maxSamplesCount)).map(_.getOrElse(defaultConfiguration.maxSamplesCount))
          case _ => Future.successful(config.maxSamplesCount)
        }

        maxSamplesCountFuture flatMap { maxSamplesCount =>
          val project = Project(projectID, name, description, user.uuid, s"${config.storagePath}/$projectID", maxSamplesCount)
          db.run(projects += project) map {
            case 1 => project
            case _ => throw new RuntimeException("Cannot create Project instance in database: Internal error")
          } onSuccessSideEffect { _ =>
            events.publish(ProjectProviderEvents.ProjectCreated(project))
          }
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

  def delete(uuid: UUID): Future[Int] = {
    val projectAction = projects.filter(_.uuid === uuid).result.headOption
    val deleteAction  = projects.filter(_.uuid === uuid).delete
    db.run(projectAction zip deleteAction) onSuccessSideEffect {
      case (project, _) =>
        project.foreach(p => events.publish(ProjectProviderEvents.ProjectDeleted(p)))
    } map (_._2)
  }

}
