package effects

import akka.actor.{Actor, ActorSystem, Props}
import com.google.inject.{Inject, Singleton}
import models.token.VerificationTokenProvider
import models.user.{UserProvider, UserProviderEvent, UserProviderEvents}
import play.api.inject.ApplicationLifecycle

object UserEffectsActor {
  def props(up: UserProvider, vtp: VerificationTokenProvider): Props = Props(new UserEffectsActor(up, vtp))
}

class UserEffectsActor(up: UserProvider, vtp: VerificationTokenProvider) extends Actor {
  override def receive: Receive = {
    case UserProviderEvents.UserCreated(uuid) => vtp.create(uuid)
  }
}

@Singleton
class UserEffects @Inject()(lifecycle: ApplicationLifecycle, actorSystem: ActorSystem, up: UserProvider, vtp: VerificationTokenProvider)
    extends AbstractEffects[UserProviderEvent](lifecycle) {
  override final lazy val effects = actorSystem.actorOf(UserEffectsActor.props(up, vtp), "user-effects-actor")

  override def stream: EventStreaming[UserProviderEvent] = up
}
