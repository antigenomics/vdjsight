package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectProviderEvent, ProjectProviderEvents}
import play.api.inject.ApplicationLifecycle

object ProjectEffectsActor {
  def props(): Props = Props(new ProjectEffectsActor())
}

class ProjectEffectsActor() extends Actor {
  override def receive: Receive = {
    case ProjectProviderEvents.ProjectCreated(uuid) =>
    case ProjectProviderEvents.ProjectUpdated(uuid) =>
    case ProjectProviderEvents.ProjectDeleted(uuid) =>
  }
}

@Singleton
class ProjectEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream) extends AbstractEffects[ProjectProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(ProjectEffectsActor.props(), "projects-effects-actor")
}
