package effects

import akka.actor.{Actor, Props}
import com.google.inject.Singleton
import javax.inject.Inject
import models.token.{ResetMethod, ResetTokenProviderEvent, ResetTokenProviderEvents}
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext

object ResetTokenEffectsActor {
  def props(implicit ec: ExecutionContext): Props = Props(new ResetTokenEffectsActor())
}

class ResetTokenEffectsActor()(implicit ec: ExecutionContext) extends Actor {
  override def receive: Receive = {
    case ResetTokenProviderEvents.TokenCreated(token, configuration) =>
      configuration.method match {
        case ResetMethod.EMAIL   => throw new NotImplementedError("Email reset method not implemented")
        case ResetMethod.CONSOLE => println(s"[ResetToken] For user ${token.userID}: ${token.token}")
        case ResetMethod.NOOP    =>
      }
  }
}

@Singleton
class ResetTokenEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream)(implicit ec: ExecutionContext)
    extends AbstractEffects[ResetTokenProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(ResetTokenEffectsActor.props, "reset-token-effects-actor")
}
