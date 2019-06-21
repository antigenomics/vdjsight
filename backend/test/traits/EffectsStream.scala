package traits

import akka.actor.ActorSystem
import akka.testkit.TestProbe
import effects.{AbstractEffectEvent, EffectsEventsStream}
import play.api.Application

import scala.reflect.{ClassTag, _}

trait EffectsStream {
  implicit private lazy val _events: EffectsEventsStream    = application.injector.instanceOf[EffectsEventsStream]
  implicit private lazy val _eventsActorSystem: ActorSystem = _events.actorSystem

  final val events = new {

    def probe[T <: AbstractEffectEvent](implicit ct: ClassTag[T]): TestProbe = {
      val probe = TestProbe()
      _events.stream.subscribe(probe.ref, classTag[T].runtimeClass)
      probe
    }

  }

  def application: Application
}
