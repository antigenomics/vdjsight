package effects

import akka.actor.{Actor, ActorSystem, Props}
import com.google.inject.{Inject, Singleton}
import models.token.{VerificationMethod, VerificationTokenProvider, VerificationTokenProviderEvent, VerificationTokenProviderEvents}
import models.user.UserProvider
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext
import scala.util.Success

object VerificationTokenEffectsActor {
  def props(up: UserProvider, vtp: VerificationTokenProvider)(implicit ec: ExecutionContext): Props = Props(new VerificationTokenEffectsActor(up, vtp))
}

class VerificationTokenEffectsActor(up: UserProvider, vtp: VerificationTokenProvider)(implicit ec: ExecutionContext) extends Actor {
  override def receive: Receive = {
    case VerificationTokenProviderEvents.TokenCreated(token, userID, configuration) =>
      configuration.method match {
        case VerificationMethod.EMAIL   => throw new NotImplementedError("Email verification method not implemented")
        case VerificationMethod.CONSOLE => println(s"[VerificationToken] For user $userID: $token")
        case VerificationMethod.AUTO    => up.verify(token)(vtp)
        case VerificationMethod.NOOP    =>
      }
    case VerificationTokenProviderEvents.TokenDeleted(_, userID, _) =>
      up.get(userID) onComplete {
        case Success(Some(user)) => if (!user.verified) up.delete(user.uuid)
        case _                   =>
      }

  }
}

@Singleton
class VerificationTokenEffects @Inject()(lifecycle: ApplicationLifecycle, actorSystem: ActorSystem, up: UserProvider, vtp: VerificationTokenProvider)(
    implicit ec: ExecutionContext)
    extends AbstractEffects[VerificationTokenProviderEvent](lifecycle) {
  override final lazy val effects = actorSystem.actorOf(VerificationTokenEffectsActor.props(up, vtp), "verification-token-effects-actor")

  override def stream: EventStreaming[VerificationTokenProviderEvent] = vtp
}
