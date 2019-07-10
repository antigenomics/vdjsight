package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.{UserPermissionsProvider, UserProviderEvent, UserProviderEvents}
import play.api.inject.ApplicationLifecycle

object UserEffectsActor {

  def props(
    userPermissionsProvider: UserPermissionsProvider,
    verificationTokenProvider: VerificationTokenProvider,
    resetTokenProvider: ResetTokenProvider
  ): Props = Props(new UserEffectsActor(userPermissionsProvider, verificationTokenProvider, resetTokenProvider))
}

class UserEffectsActor(
  userPermissionsProvider: UserPermissionsProvider,
  verificationTokenProvider: VerificationTokenProvider,
  resetTokenProvider: ResetTokenProvider
) extends Actor {
  override def receive: Receive = {
    case UserProviderEvents.UserCreated(user) =>
      userPermissionsProvider.create(user.uuid)
      verificationTokenProvider.create(user.uuid)
    case UserProviderEvents.UserVerified(uuid) => verificationTokenProvider.deleteForUser(uuid)
    case UserProviderEvents.UserReset(uuid)    => resetTokenProvider.deleteForUser(uuid)
  }
}

@Singleton
class UserEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  events: EffectsEventsStream,
  userPermissionsProvider: UserPermissionsProvider,
  verificationTokenProvider: VerificationTokenProvider,
  resetTokenProvider: ResetTokenProvider
) extends AbstractEffects[UserProviderEvent](lifecycle, events) {

  final override lazy val effects =
    events.actorSystem.actorOf(UserEffectsActor.props(userPermissionsProvider, verificationTokenProvider, resetTokenProvider), "user-effects-actor")
}
