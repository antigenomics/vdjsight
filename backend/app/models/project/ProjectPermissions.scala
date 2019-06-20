package models.project

import java.util.UUID

import akka.actor.{ActorRef, ActorSystem}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.EventStreaming
import models.user.UserPermissionsProvider
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.{ConfigLoader, Configuration}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.FutureUtils._

import scala.concurrent.{ExecutionContext, Future}
import scala.language.{higherKinds, implicitConversions, postfixOps}

case class ProjectPermissionsConfiguration(storagePath: String, maxSamplesCount: Long)

object ProjectPermissionsConfiguration {
  implicit val userPermissionsDefaultConfigurationLoader: ConfigLoader[ProjectPermissionsConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    ProjectPermissionsConfiguration(
      storagePath     = config.getString("storagePath"),
      maxSamplesCount = config.getLong("maxSamplesCount")
    )
  }
}

case class ProjectPermissions(uuid: UUID, projectID: UUID, folder: String, maxSamplesCount: Long)

class ProjectPermissionsTable(tag: Tag)(implicit pp: ProjectProvider) extends Table[ProjectPermissions](tag, ProjectPermissionsTable.TABLE_NAME) {
  def uuid            = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def projectID       = column[UUID]("project_id", O.Unique, O.SqlType("uuid"))
  def folder          = column[String]("folder", O.Unique, O.Length(510))
  def maxSamplesCount = column[Long]("max_samples_count")

  def * = (uuid, projectID, folder, maxSamplesCount) <> (ProjectPermissions.tupled, ProjectPermissions.unapply)

  def project = foreignKey("project_permissions_table_project_fk", projectID, pp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
  )

  def project_id_idx = index("project_permissions_table_project_id_idx", projectID, unique = true)
}

object ProjectPermissionsTable {
  final val TABLE_NAME = "project_permissions"

  implicit class ProjectPermissionsTableExtension[C[_]](q: Query[ProjectPermissionsTable, ProjectPermissions, C]) {

    def withProject(implicit pp: ProjectProvider): Query[(ProjectPermissionsTable, ProjectTable), (ProjectPermissions, Project), C] = {
      q.join(pp.table).on(_.projectID === _.uuid)
    }

  }
}

trait ProjectPermissionProviderEvent

object ProjectPermissionProviderEvents {
  case class ProjectPermissionCreated(permission: ProjectPermissions) extends ProjectPermissionProviderEvent
}

@Singleton
class ProjectPermissionsProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider, conf: Configuration)(
  implicit ec: ExecutionContext,
  pp: ProjectProvider,
  upp: UserPermissionsProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with EventStreaming[ProjectPermissionProviderEvent] {

  final private val logger               = LoggerFactory.getLogger(this.getClass)
  final private val defaultConfiguration = conf.get[ProjectPermissionsConfiguration]("application.projects.permissions")
  final private val actorSystem          = ActorSystem.create("ProjectPermissionsProviderActorSystem")
  final private val eventStream          = actorSystem.eventStream

  final private val permissions = TableQuery[ProjectPermissionsTable]

  def table: TableQuery[ProjectPermissionsTable] = permissions

  def subscribe(subscriber: ActorRef): Unit = eventStream.subscribe(subscriber, classOf[ProjectPermissionProviderEvent])

  def unsubscribe(subscriber: ActorRef): Unit = eventStream.unsubscribe(subscriber)

  def all: Future[Seq[ProjectPermissions]] = db.run(permissions.result)

  def get(uuid: UUID): Future[Option[ProjectPermissions]] = db.run(permissions.filter(_.uuid === uuid).result.headOption)

  def findForProject(projectID: UUID): Future[Option[ProjectPermissions]] = db.run(permissions.filter(_.projectID === projectID).result.headOption)

  def getWithProject(uuid: UUID): Future[Option[(ProjectPermissions, Project)]] = db.run(permissions.withProject.filter(_._1.uuid === uuid).result.headOption)

  def create(projectID: UUID, configuration: Option[ProjectPermissionsConfiguration] = None): Future[UUID] = {
    val checkProjectExist     = pp.table.filter(_.uuid         === projectID).result.headOption
    val checkPermissionsExist = permissions.filter(_.projectID === projectID).result.headOption

    db.run((checkProjectExist zip checkPermissionsExist).transactionally) flatMap {
      case (Some(_), Some(permission)) => Future.successful(permission.uuid)
      case (Some(project), None) =>
        val uuid   = UUID.randomUUID()
        val config = configuration.getOrElse(defaultConfiguration)

        val maxSamplesCountFuture = config.maxSamplesCount match {
          case 0 => upp.findForUser(project.ownerID).map(_.map(_.maxSamplesCount)).map(_.getOrElse(config.maxSamplesCount))
          case _ => Future.successful(config.maxSamplesCount)
        }

        maxSamplesCountFuture flatMap { maxSamplesCount =>
          val permission = ProjectPermissions(
            uuid            = uuid,
            projectID       = projectID,
            folder          = s"${config.storagePath}/$projectID/",
            maxSamplesCount = maxSamplesCount
          )

          db.run(permissions += permission) map {
            case 1 => uuid
            case _ => throw new RuntimeException("Cannot create VerificationToken instance in database: Internal error")
          } onSuccessSideEffect { _ =>
            eventStream.publish(ProjectPermissionProviderEvents.ProjectPermissionCreated(permission))
          }
        }
      case (None, _) => throw new RuntimeException("Cannot create UserPermissions instance in database: User does not exist")
    }
  }

}
