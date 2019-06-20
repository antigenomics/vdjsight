package effects

import akka.actor.ActorRef
import com.google.inject.AbstractModule
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future

class EffectsModule extends AbstractModule {
  override def configure(): Unit = {
    bind(classOf[UserEffects]).asEagerSingleton()
    bind(classOf[UserPermissionsEffects]).asEagerSingleton()
    bind(classOf[VerificationTokenEffects]).asEagerSingleton()
    bind(classOf[ResetTokenEffects]).asEagerSingleton()
    bind(classOf[ProjectEffects]).asEagerSingleton()
    bind(classOf[ProjectPermissionsEffects]).asEagerSingleton()
  }
}

trait EventStreaming[T] {
  type EventType = T
  def subscribe(subscriber: ActorRef): Unit
  def unsubscribe(subscriber: ActorRef): Unit
}

abstract class AbstractEffects[T](lifecycle: ApplicationLifecycle) {
  lazy val effects: ActorRef = null

  def stream: EventStreaming[T]

  stream.subscribe(effects)

  lifecycle.addStopHook { () =>
    Future.successful(stream.unsubscribe(effects))
  }
}
