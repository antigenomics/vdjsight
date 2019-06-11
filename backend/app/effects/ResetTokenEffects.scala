package effects

import akka.actor.{Actor, ActorSystem, Props}
import com.google.inject.Singleton
import javax.inject.Inject
import models.token.{ResetMethod, ResetTokenProvider, ResetTokenProviderEvent, ResetTokenProviderEvents}
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext

object ResetTokenEffectsActor {
  def props(implicit ec: ExecutionContext): Props = Props(new ResetTokenEffectsActor())
}

class ResetTokenEffectsActor()(implicit ec: ExecutionContext) extends Actor {
  override def receive: Receive = {
    case ResetTokenProviderEvents.TokenCreated(token, userID, configuration) =>
      configuration.method match {
        case ResetMethod.EMAIL   => throw new NotImplementedError("Email reset method not implemented")
        case ResetMethod.CONSOLE => println(s"[ResetToken] For user $userID: $token")
        case ResetMethod.NOOP    =>
      }
  }
}

@Singleton
class ResetTokenEffects @Inject()(lifecycle: ApplicationLifecycle, actorSystem: ActorSystem, rtp: ResetTokenProvider)(implicit ec: ExecutionContext)
    extends AbstractEffects[ResetTokenProviderEvent](lifecycle) {

  override final lazy val effects = actorSystem.actorOf(ResetTokenEffectsActor.props, "reset-token-effects-actor")

  override def stream: EventStreaming[ResetTokenProviderEvent] = rtp
}
