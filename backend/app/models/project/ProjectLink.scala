package models.project

import java.sql.Timestamp
import java.time.Duration
import java.util.UUID

import akka.actor.{ActorSystem, Cancellable}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.user.{User, UserProvider, UserTable}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.inject.ApplicationLifecycle
import play.api.{ConfigLoader, Configuration, Logging}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.FutureUtils._
import utils.TimeUtils

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.language.{higherKinds, implicitConversions, postfixOps}
import scala.util.Failure

case class ProjectLinkDeleteConfiguration(keep: Duration, interval: Duration)

object ProjectLinkDeleteConfiguration {
  implicit val projectLinkDeleteConfigurationLoader: ConfigLoader[ProjectLinkDeleteConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    ProjectLinkDeleteConfiguration(
      keep     = config.getDuration("keep"),
      interval = config.getDuration("interval")
    )
  }
}

case class ProjectLinksConfiguration(delete: ProjectLinkDeleteConfiguration)

object ProjectLinksConfiguration {
  implicit val projectLinkConfigurationLoader: ConfigLoader[ProjectLinksConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    ProjectLinksConfiguration(
      delete = ProjectLinkDeleteConfiguration.projectLinkDeleteConfigurationLoader.load(config, "delete")
    )
  }
}

case class ProjectLink(
  uuid: UUID,
  projectID: UUID,
  userID: UUID,
  isShared: Boolean,
  isUploadAllowed: Boolean,
  isDeleteAllowed: Boolean,
  isModificationAllowed: Boolean,
  deleteOn: Option[Timestamp]
)

class ProjectLinkTable(tag: Tag)(implicit pp: ProjectProvider, up: UserProvider) extends Table[ProjectLink](tag, ProjectLinkTable.TABLE_NAME) {
  def uuid                  = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def projectID             = column[UUID]("project_id", O.SqlType("uuid"))
  def userID                = column[UUID]("user_id", O.SqlType("uuid"))
  def isShared              = column[Boolean]("is_shared")
  def isUploadAllowed       = column[Boolean]("is_upload_allowed")
  def isDeleteAllowed       = column[Boolean]("is_delete_allowed")
  def isModificationAllowed = column[Boolean]("is_modification_allowed")
  def deleteOn              = column[Option[Timestamp]]("delete_on")

  def * =
    (
      uuid,
      projectID,
      userID,
      isShared,
      isUploadAllowed,
      isDeleteAllowed,
      isModificationAllowed,
      deleteOn
    ) <> (ProjectLink.tupled, ProjectLink.unapply)

  def project = foreignKey("project_link_table_project_fk", projectID, pp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
  )

  def user = foreignKey("project_link_table_project_fk", userID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
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

trait ProjectLinkProviderEvent extends AbstractEffectEvent

object ProjectLinkProviderEvents {
  case class ProjectLinkProviderInitialized(configuration: ProjectLinksConfiguration) extends ProjectLinkProviderEvent
  case class ProjectLinkCreated(link: ProjectLink) extends ProjectLinkProviderEvent
  case class ProjectLinkDeleteScheduled(linkID: UUID) extends ProjectLinkProviderEvent
  case class ProjectLinkDeleteCancelled(linkID: UUID) extends ProjectLinkProviderEvent
  case class ProjectLinkDeleted(link: ProjectLink) extends ProjectLinkProviderEvent
}

@Singleton
class ProjectLinkProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  events: EffectsEventsStream
)(
  implicit
  ec: ExecutionContext,
  pp: ProjectProvider,
  up: UserProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with Logging {

  final private val configuration = conf.get[ProjectLinksConfiguration]("application.projects.links")

  import dbConfig.profile.api._

  final private val links = TableQuery[ProjectLinkTable]

  events.publish(ProjectLinkProviderEvents.ProjectLinkProviderInitialized(configuration))

  final private val expiredLinksDeleteScheduler: Option[Cancellable] = Option(!configuration.delete.interval.isZero).collect {
    case true =>
      actorSystem.scheduler.schedule(10 seconds, configuration.delete.interval.getSeconds seconds) {
        expired().map(_.map(_.uuid)).flatMap(delete) onComplete {
          case Failure(exception) => logger.warn("Cannot delete expired project links", exception)
          case _                  =>
        }
      }
  }

  lifecycle.addStopHook { () =>
    Future.successful(expiredLinksDeleteScheduler.foreach(_.cancel()))
  }

  def table: TableQuery[ProjectLinkTable] = links

  def all: Future[Seq[ProjectLink]] = db.run(links.result)

  def get(uuid: UUID): Future[Option[ProjectLink]] = db.run(links.filter(_.uuid === uuid).result.headOption)

  def findForUser(userID: UUID): Future[Seq[ProjectLink]] = db.run(links.filter(_.userID === userID).result)

  def findForUserWithProject(userID: UUID): Future[Seq[(ProjectLink, Project)]] = db.run(links.withProject.filter(_._1.userID === userID).result)

  def findForProject(projectID: UUID): Future[Seq[ProjectLink]] = db.run(links.filter(_.projectID === projectID).result)

  def findForProjectWithUser(projectID: UUID): Future[Seq[(ProjectLink, User)]] = db.run(links.withUser.filter(_._1.projectID === projectID).result)

  def getWithUser(uuid: UUID): Future[Option[(ProjectLink, User)]] = db.run(links.withUser.filter(_._1.uuid === uuid).result.headOption)

  def getWithProject(uuid: UUID): Future[Option[(ProjectLink, Project)]] = db.run(links.withProject.filter(_._1.uuid === uuid).result.headOption)

  def create(
    userID: UUID,
    projectID: UUID,
    isUploadAllowed: Boolean       = true,
    isDeleteAllowed: Boolean       = true,
    isModificationAllowed: Boolean = true
  ): Future[ProjectLink] = {
    val actions = up.table.filter(_.uuid === userID).result.headOption flatMap {
        case Some(user) =>
          pp.table.filter(_.uuid === projectID).result.headOption flatMap {
            case Some(project) =>
              links.filter(link => link.userID === userID && link.projectID === projectID).result.headOption flatMap {
                case Some(link) => DBIO.successful(link)
                case None =>
                  val isShared = project.ownerID != user.uuid
                  val linkID   = UUID.randomUUID()
                  val link = ProjectLink(
                    uuid                  = linkID,
                    projectID             = projectID,
                    userID                = userID,
                    isShared              = isShared,
                    isUploadAllowed       = isUploadAllowed,
                    isDeleteAllowed       = isDeleteAllowed,
                    isModificationAllowed = isModificationAllowed,
                    deleteOn              = None
                  )
                  (links += link) flatMap {
                    case 0 => DBIO.failed(new Exception("Cannot create ProjectLink instance in database: Unknown error"))
                    case _ =>
                      events.publish(ProjectLinkProviderEvents.ProjectLinkCreated(link))
                      DBIO.successful(link)
                  }
              }
            case None => DBIO.failed(new Exception("Cannot create ProjectLink instance in database: Project does not exist"))
          }
        case None => DBIO.failed(new Exception("Cannot create ProjectLink instance in database: User does not exist"))
      }

    db.run(actions.transactionally)
  }

  def scheduleDelete(uuid: UUID): Future[Boolean] = {
    val actions = links.withProject.filter(_._1.uuid === uuid).result.headOption flatMap {
        case Some((link, project)) =>
          links.filter(_.uuid === link.uuid).map(_.deleteOn).update(Some(TimeUtils.getExpiredAt(configuration.delete.keep))) flatMap { u =>
            project.ownerID match {
              case link.userID => pp.table.filter(_.uuid === link.projectID).map(_.isDangling).update(true).map(_ + u)
              case _           => DBIO.successful(u)
            }
          }
        case None => DBIO.failed(new Exception("Cannot schedule ProjectLink instance delete: Link does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { _ =>
      events.publish(ProjectLinkProviderEvents.ProjectLinkDeleteScheduled(uuid))
    } map {
      case 0 => false
      case _ => true
    }
  }

  def cancelScheduledDelete(uuid: UUID): Future[Boolean] = {
    val actions = links.withProject.filter(_._1.uuid === uuid).result.headOption flatMap {
        case Some((link, project)) =>
          links.filter(_.uuid === link.uuid).map(_.deleteOn).update(None) flatMap { u =>
            project.ownerID match {
              case link.userID => pp.table.filter(_.uuid === link.projectID).map(_.isDangling).update(false).map(_ + u)
              case _           => DBIO.successful(u)
            }
          }
        case None => DBIO.failed(new Exception("Cannot cancel scheduled ProjectLink instance deletion: Link does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { _ =>
      events.publish(ProjectLinkProviderEvents.ProjectLinkDeleteCancelled(uuid))
    } map {
      case 0 => false
      case _ => true
    }
  }

  def delete(uuid: UUID): Future[Boolean] = {
    val actions = links.filter(_.uuid === uuid).result.headOption flatMap {
        case Some(link) => links.filter(_.uuid === uuid).delete map (_ => link)
        case None       => DBIO.failed(new Exception("Cannot delete ProjectLink instance: Link does not exist"))
      }

    db.run(actions.transactionally) onSuccessSideEffect { link =>
      events.publish(ProjectLinkProviderEvents.ProjectLinkDeleted(link))
    } map (_ => true)
  }

  def delete(seq: Seq[UUID]): Future[Boolean] = Future.sequence(seq.map(delete)).map(_.forall(_ == true))

  def expired(date: Timestamp = TimeUtils.getCurrentTimestamp): Future[Seq[ProjectLink]] =
    db.run(links.filter(l => l.deleteOn.nonEmpty && l.deleteOn < date).result)

}
