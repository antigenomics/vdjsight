package effects

import akka.actor.{Actor, ActorSystem, Props}
import com.google.inject.{Inject, Singleton}
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.{UserPermissionsProvider, UserProvider, UserProviderEvent, UserProviderEvents}
import play.api.inject.ApplicationLifecycle

object UserEffectsActor {
  def props(upp: UserPermissionsProvider, vtp: VerificationTokenProvider, rtp: ResetTokenProvider): Props = Props(new UserEffectsActor(upp, vtp, rtp))
}

class UserEffectsActor(upp: UserPermissionsProvider, vtp: VerificationTokenProvider, rtp: ResetTokenProvider) extends Actor {
  override def receive: Receive = {
    case UserProviderEvents.UserCreated(uuid) =>
      upp.create(uuid)
      vtp.create(uuid)
    case UserProviderEvents.UserVerified(uuid) => vtp.deleteForUser(uuid)
    case UserProviderEvents.UserReset(uuid)    => rtp.deleteForUser(uuid)
  }
}

@Singleton
class UserEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  up: UserProvider,
  upp: UserPermissionsProvider,
  vtp: VerificationTokenProvider,
  rtp: ResetTokenProvider
) extends AbstractEffects[UserProviderEvent](lifecycle) {
  final override lazy val effects = actorSystem.actorOf(UserEffectsActor.props(upp, vtp, rtp), "user-effects-actor")

  override def stream: EventStreaming[UserProviderEvent] = up
}
