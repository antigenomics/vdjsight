package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectLinkProviderEvent, ProjectLinkProviderEvents, ProjectProvider}
import models.sample.SampleFileLinkProvider
import play.api.Logging
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext

object ProjectLinkEffectsActor {

  def props(projectProvider: ProjectProvider, sampleFileLinkProvider: SampleFileLinkProvider)(implicit ec: ExecutionContext): Props = {
    Props(new ProjectLinkEffectsActor(projectProvider, sampleFileLinkProvider))
  }
}

class ProjectLinkEffectsActor(projectProvider: ProjectProvider, sampleFileLinkProvider: SampleFileLinkProvider)(
  implicit ec: ExecutionContext
) extends Actor
    with Logging {
  override def receive: Receive = {
    case ProjectLinkProviderEvents.ProjectLinkProviderInitialized(_) =>
    case ProjectLinkProviderEvents.ProjectLinkCreated(_)             =>
    case ProjectLinkProviderEvents.ProjectLinkDeleted(link) =>
      projectProvider.get(link.projectID) collect {
        case Some(project) =>
          if (project.ownerID == link.userID) {
            sampleFileLinkProvider.findForProject(project.uuid) flatMap { sampleFileLinks =>
              sampleFileLinkProvider.delete(sampleFileLinks.map(_.uuid)) flatMap { _ =>
                projectProvider.delete(link.projectID)
              }
            }
          }
      } recover {
        case exception: Exception => logger.error("Failed to apply ProjectLinkDeleted effect from ProjectLinkEffectsActor", exception)
      }
  }
}

@Singleton
class ProjectLinkEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  events: EffectsEventsStream,
  projectProvider: ProjectProvider,
  sampleFileLinkProvider: SampleFileLinkProvider
)(
  implicit ec: ExecutionContext
) extends AbstractEffects[ProjectLinkProviderEvent](lifecycle, events) {

  final override lazy val effects =
    events.actorSystem.actorOf(ProjectLinkEffectsActor.props(projectProvider, sampleFileLinkProvider), "project-link-effects-actor")
}
