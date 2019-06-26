package models.project

import java.sql.Timestamp
import java.time.Duration
import java.util.UUID

import akka.actor.{ActorSystem, Cancellable}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.user.{User, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.inject.ApplicationLifecycle
import play.api.{ConfigLoader, Configuration}
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

case class ProjectLinkConfiguration(delete: ProjectLinkDeleteConfiguration)

object ProjectLinkConfiguration {
  implicit val projectLinkConfigurationLoader: ConfigLoader[ProjectLinkConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    ProjectLinkConfiguration(
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

trait ProjectLinkProviderEvent extends AbstractEffectEvent

object ProjectLinkProviderEvents {
  case class ProjectLinkCreated(projectLink: ProjectLink) extends ProjectLinkProviderEvent
  case class ProjectLinkDeleteScheduled(linkID: UUID) extends ProjectLinkProviderEvent
  case class ProjectLinkDeleteCancelled(linkID: UUID) extends ProjectLinkProviderEvent
  case class ProjectLinkDeleted(projectLink: ProjectLink) extends ProjectLinkProviderEvent
}

@Singleton
class ProjectLinkProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  events: EffectsEventsStream
)(
  implicit ec: ExecutionContext,
  pp: ProjectProvider,
  up: UserProvider
) extends HasDatabaseConfigProvider[JdbcProfile] {

  final private val logger        = LoggerFactory.getLogger(this.getClass)
  final private val configuration = conf.get[ProjectLinkConfiguration]("application.projects.links")

  import dbConfig.profile.api._

  final private val links = TableQuery[ProjectLinkTable]

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

  def getWithUser(uuid: UUID): Future[Option[(ProjectLink, User)]] = db.run(links.withUser.filter(_._1.uuid === uuid).result.headOption)

  def getWithProject(uuid: UUID): Future[Option[(ProjectLink, Project)]] = db.run(links.withProject.filter(_._1.uuid === uuid).result.headOption)

  def create(
    userID: UUID,
    projectID: UUID,
    isUploadAllowed: Boolean       = true,
    isDeleteAllowed: Boolean       = true,
    isModificationAllowed: Boolean = true
  ): Future[ProjectLink] = {

    val checkUserExist    = up.table.filter(_.uuid === userID).result.headOption
    val checkProjectExist = pp.table.filter(_.uuid === projectID).result.headOption
    val checkLinkExist = links
      .filter(
        link =>
          link.userID    === userID &&
          link.projectID === projectID
      )
      .result
      .headOption

    db.run((checkUserExist zip checkProjectExist zip checkLinkExist).transactionally) flatMap {
      case ((Some(_), Some(_)), Some(link)) => Future.successful(link)
      case ((Some(user), Some(project)), None) =>
        val isShared = project.ownerID != user.uuid
        val linkID   = UUID.randomUUID()
        val link = ProjectLink(
          linkID,
          projectID,
          userID,
          isShared,
          isUploadAllowed,
          isDeleteAllowed,
          isModificationAllowed,
          None
        )

        db.run(links += link) map {
          case 1 => link
          case _ => throw new RuntimeException("Cannot create ProjectLink instance in database: Internal error")
        } onSuccessSideEffect { _ =>
          events.publish(ProjectLinkProviderEvents.ProjectLinkCreated(link))
        }

      case ((None, _), _) => throw new RuntimeException("Cannot create VerificationToken instance in database: User does not exist")
      case ((_, None), _) => throw new RuntimeException("Cannot create VerificationToken instance in database: Project does not exist")
    }
  }

  def scheduleDelete(uuid: UUID): Future[Int] = {
    db.run(
      links.filter(_.uuid === uuid).map(_.deleteOn).update(Some(TimeUtils.getExpiredAt(configuration.delete.keep)))
    ) onSuccessSideEffect {
      case 1 => events.publish(ProjectLinkProviderEvents.ProjectLinkDeleteScheduled(uuid))
      case _ =>
    }
  }

  def cancelScheduledDelete(uuid: UUID): Future[Int] = {
    db.run(
      links.filter(_.uuid === uuid).map(_.deleteOn).update(None)
    ) onSuccessSideEffect {
      case 1 => events.publish(ProjectLinkProviderEvents.ProjectLinkDeleteCancelled(uuid))
      case _ =>
    }
  }

  def delete(uuid: UUID): Future[Int] = {
    val linkAction   = links.filter(_.uuid === uuid).result.headOption
    val deleteAction = links.filter(_.uuid === uuid).delete

    db.run((linkAction zip deleteAction).transactionally) onSuccessSideEffect {
      case (Some(link), 1) => events.publish(ProjectLinkProviderEvents.ProjectLinkDeleted(link))
      case _               => logger.warn(s"Cannot delete project link: $uuid")
    } map (_._2)
  }

  def delete(seq: Seq[UUID]): Future[Int] = Future.sequence(seq.map(delete)).map(_.sum)

  def expired(date: Timestamp = TimeUtils.getCurrentTimestamp): Future[Seq[ProjectLink]] =
    db.run(links.filter(l => l.deleteOn.nonEmpty && l.deleteOn < date).result)

}
