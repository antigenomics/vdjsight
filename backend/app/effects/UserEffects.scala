package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.{UserPermissionsProvider, UserProviderEvent, UserProviderEvents}
import play.api.inject.ApplicationLifecycle

object UserEffectsActor {
  def props(upp: UserPermissionsProvider, vtp: VerificationTokenProvider, rtp: ResetTokenProvider): Props = Props(new UserEffectsActor(upp, vtp, rtp))
}

class UserEffectsActor(upp: UserPermissionsProvider, vtp: VerificationTokenProvider, rtp: ResetTokenProvider) extends Actor {
  override def receive: Receive = {
    case UserProviderEvents.UserCreated(user) =>
      upp.create(user.uuid)
      vtp.create(user.uuid)
    case UserProviderEvents.UserVerified(uuid) => vtp.deleteForUser(uuid)
    case UserProviderEvents.UserReset(uuid)    => rtp.deleteForUser(uuid)
  }
}

@Singleton
class UserEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  events: EffectsEventsStream,
  upp: UserPermissionsProvider,
  vtp: VerificationTokenProvider,
  rtp: ResetTokenProvider
) extends AbstractEffects[UserProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(UserEffectsActor.props(upp, vtp, rtp), "user-effects-actor")
}
