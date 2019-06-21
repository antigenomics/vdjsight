package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectPermissionsProvider, ProjectProviderEvent, ProjectProviderEvents}
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
class ProjectEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream, ppp: ProjectPermissionsProvider)
    extends AbstractEffects[ProjectProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(ProjectEffectsActor.props(ppp), "projects-effects-actor")
}
