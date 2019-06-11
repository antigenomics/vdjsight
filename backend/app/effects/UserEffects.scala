package effects

import akka.actor.{Actor, ActorSystem, Props}
import com.google.inject.{Inject, Singleton}
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.{UserProvider, UserProviderEvent, UserProviderEvents}
import play.api.inject.ApplicationLifecycle

object UserEffectsActor {
  def props(vtp: VerificationTokenProvider, rtp: ResetTokenProvider): Props = Props(new UserEffectsActor(vtp, rtp))
}

class UserEffectsActor(vtp: VerificationTokenProvider, rtp: ResetTokenProvider) extends Actor {
  override def receive: Receive = {
    case UserProviderEvents.UserCreated(uuid)  => vtp.create(uuid)
    case UserProviderEvents.UserVerified(uuid) => vtp.deleteForUser(uuid)
    case UserProviderEvents.UserReset(uuid)    => rtp.deleteForUser(uuid)
  }
}

@Singleton
class UserEffects @Inject()(lifecycle: ApplicationLifecycle,
                            actorSystem: ActorSystem,
                            up: UserProvider,
                            vtp: VerificationTokenProvider,
                            rtp: ResetTokenProvider)
    extends AbstractEffects[UserProviderEvent](lifecycle) {
  override final lazy val effects = actorSystem.actorOf(UserEffectsActor.props(vtp, rtp), "user-effects-actor")

  override def stream: EventStreaming[UserProviderEvent] = up
}
