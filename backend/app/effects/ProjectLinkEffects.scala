package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectLinkProviderEvent, ProjectLinkProviderEvents}
import play.api.inject.ApplicationLifecycle

object ProjectLinkEffectsActor {
  def props(): Props = Props(new UserPermissionsEffectsActor())
}

class ProjectLinkEffectsActor() extends Actor {
  override def receive: Receive = {
    case ProjectLinkProviderEvents.ProjectLinkCreated(_, _) =>
    case ProjectLinkProviderEvents.ProjectLinkDeleted(_, _) =>
  }
}

@Singleton
class ProjectLinkEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream)
    extends AbstractEffects[ProjectLinkProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(UserPermissionsEffectsActor.props(), "project-link-effects-actor")
}
