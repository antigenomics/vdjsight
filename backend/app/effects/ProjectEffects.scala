package effects

import akka.actor.{Actor, ActorSystem, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectPermissionsProvider, ProjectProvider, ProjectProviderEvent, ProjectProviderEvents}
import play.api.inject.ApplicationLifecycle

object ProjectEffectsActor {
  def props(ppp: ProjectPermissionsProvider): Props = Props(new ProjectEffectsActor(ppp))
}

class ProjectEffectsActor(ppp: ProjectPermissionsProvider) extends Actor {
  override def receive: Receive = {
    case ProjectProviderEvents.ProjectCreated(uuid) => ppp.create(uuid)
    case ProjectProviderEvents.ProjectUpdated(uuid) =>
    case ProjectProviderEvents.ProjectDeleted(uuid) =>
  }
}

@Singleton
class ProjectEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  pp: ProjectProvider,
  ppp: ProjectPermissionsProvider
) extends AbstractEffects[ProjectProviderEvent](lifecycle) {
  final override lazy val effects = actorSystem.actorOf(ProjectEffectsActor.props(ppp), "projects-effects-actor")

  override def stream: EventStreaming[ProjectProviderEvent] = pp
}
