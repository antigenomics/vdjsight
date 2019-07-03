package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.user.{UserPermissionsProviderEvent, UserPermissionsProviderEvents}
import play.api.inject.ApplicationLifecycle

object UserPermissionsEffectsActor {
  def props(): Props = Props(new UserPermissionsEffectsActor())
}

class UserPermissionsEffectsActor() extends Actor {
  override def receive: Receive = {
    case UserPermissionsProviderEvents.UserPermissionsCreated(_) =>
  }
}

@Singleton
class UserPermissionsEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream)
    extends AbstractEffects[UserPermissionsProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(UserPermissionsEffectsActor.props(), "user-permissions-effects-actor")
}
