package effects

import akka.actor.ActorSystem
import akka.event.EventStream
import com.google.inject.{Inject, Singleton}

trait AbstractEffectEvent

@Singleton
class EffectsEventsStream @Inject()() {
  final private val _actorSystem = ActorSystem.create("effects-stream")
  final private val _eventStream = _actorSystem.eventStream

  def stream: EventStream = _eventStream

  def actorSystem: ActorSystem = _actorSystem

  def publish[T <: AbstractEffectEvent](event: T): Unit = _eventStream.publish(event)
}
