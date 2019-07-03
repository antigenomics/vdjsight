package effects

import akka.actor.{Actor, Props}
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
    case VerificationTokenProviderEvents.TokenCreated(token, configuration) =>
      configuration.method match {
        case VerificationMethod.EMAIL   => throw new NotImplementedError("Email verification method not implemented")
        case VerificationMethod.CONSOLE => println(s"[VerificationToken] For user ${token.userID}: ${token.token}")
        case VerificationMethod.AUTO    => up.verify(token.token)(vtp)
        case VerificationMethod.NOOP    =>
      }
    case VerificationTokenProviderEvents.TokenDeleted(token, _) =>
      up.get(token.userID) onComplete {
        case Success(Some(user)) => if (!user.verified) up.delete(user.uuid)
        case _                   =>
      }

  }
}

@Singleton
class VerificationTokenEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream, up: UserProvider, vtp: VerificationTokenProvider)(
  implicit ec: ExecutionContext
) extends AbstractEffects[VerificationTokenProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(VerificationTokenEffectsActor.props(up, vtp), "verification-token-effects-actor")
}
