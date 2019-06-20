package effects

import akka.actor.{Actor, ActorSystem, Props}
import com.google.inject.{Inject, Singleton}
import models.user.{UserPermissionsProvider, UserPermissionsProviderEvent, UserPermissionsProviderEvents}
import play.api.inject.ApplicationLifecycle

object UserPermissionsEffectsActor {
  def props(): Props = Props(new UserPermissionsEffectsActor())
}

class UserPermissionsEffectsActor() extends Actor {
  override def receive: Receive = {
    case UserPermissionsProviderEvents.UserPermissionCreated(_) =>
  }
}

@Singleton
class UserPermissionsEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  upp: UserPermissionsProvider
) extends AbstractEffects[UserPermissionsProviderEvent](lifecycle) {
  final override lazy val effects = actorSystem.actorOf(UserPermissionsEffectsActor.props(), "user-permissions-effects-actor")

  override def stream: EventStreaming[UserPermissionsProviderEvent] = upp
}
