package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectLinkProviderEvent, ProjectLinkProviderEvents, ProjectProvider}
import play.api.Logging
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

object ProjectLinkEffectsActor {
  def props(pp: ProjectProvider)(implicit ec: ExecutionContext): Props = Props(new ProjectLinkEffectsActor(pp))
}

class ProjectLinkEffectsActor(pp: ProjectProvider)(implicit ec: ExecutionContext) extends Actor with Logging {
  override def receive: Receive = {
    case ProjectLinkProviderEvents.ProjectLinkCreated(_) =>
    case ProjectLinkProviderEvents.ProjectLinkDeleted(link) =>
      pp.get(link.projectID) onComplete {
        case Success(Some(project)) =>
          if (project.ownerID == link.userID) {
            pp.delete(link.projectID)
          }
        case Success(None) =>
          logger.error("Failed to apply ProjectLinkDeleted effect from ProjectLinkEffectsActor: empty project")
        case Failure(exception) =>
          logger.error("Failed to apply ProjectLinkDeleted effect from ProjectLinkEffectsActor", exception)
      }
  }
}

@Singleton
class ProjectLinkEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream, pp: ProjectProvider)(
  implicit ec: ExecutionContext
) extends AbstractEffects[ProjectLinkProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(ProjectLinkEffectsActor.props(pp), "project-link-effects-actor")
}
