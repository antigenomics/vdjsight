package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.token.{VerificationMethod, VerificationTokenProvider, VerificationTokenProviderEvent, VerificationTokenProviderEvents}
import models.user.UserProvider
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext
import scala.util.Success

object VerificationTokenEffectsActor {

  def props(userProvider: UserProvider, verificationTokenProvider: VerificationTokenProvider)(implicit ec: ExecutionContext): Props =
    Props(new VerificationTokenEffectsActor(userProvider, verificationTokenProvider))
}

class VerificationTokenEffectsActor(userProvider: UserProvider, verificationTokenProvider: VerificationTokenProvider)(
  implicit ec: ExecutionContext
) extends Actor {
  override def receive: Receive = {
    case VerificationTokenProviderEvents.TokenCreated(token, configuration) =>
      configuration.method match {
        case VerificationMethod.EMAIL   => throw new NotImplementedError("Email verification method not implemented")
        case VerificationMethod.CONSOLE => println(s"[VerificationToken] For user ${token.userID}: ${token.token}")
        case VerificationMethod.AUTO    => userProvider.verify(token.token)(verificationTokenProvider)
        case VerificationMethod.NOOP    =>
      }
    case VerificationTokenProviderEvents.TokenDeleted(token, _) =>
      userProvider.get(token.userID) onComplete {
        case Success(Some(user)) => if (!user.verified) userProvider.delete(user.uuid)
        case _                   =>
      }

  }
}

@Singleton
class VerificationTokenEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  events: EffectsEventsStream,
  userProvider: UserProvider,
  verificationTokenProvider: VerificationTokenProvider
)(
  implicit ec: ExecutionContext
) extends AbstractEffects[VerificationTokenProviderEvent](lifecycle, events) {

  final override lazy val effects =
    events.actorSystem.actorOf(VerificationTokenEffectsActor.props(userProvider, verificationTokenProvider), "verification-token-effects-actor")
}
