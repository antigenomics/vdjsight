package effects

import akka.actor.ActorRef
import com.google.inject.AbstractModule
import play.api.inject.ApplicationLifecycle

import scala.concurrent.Future
import scala.reflect._

class EffectsModule extends AbstractModule {
  override def configure(): Unit = {
    bind(classOf[UserEffects]).asEagerSingleton()
    bind(classOf[UserPermissionsEffects]).asEagerSingleton()
    bind(classOf[VerificationTokenEffects]).asEagerSingleton()
    bind(classOf[ResetTokenEffects]).asEagerSingleton()
    bind(classOf[ProjectEffects]).asEagerSingleton()
    bind(classOf[ProjectLinkEffects]).asEagerSingleton()
    bind(classOf[SampleFilesEffects]).asEagerSingleton()
    bind(classOf[SampleFileLinkEffects]).asEagerSingleton()
    bind(classOf[AnalysisCacheEffects]).asEagerSingleton()
  }
}

abstract class AbstractEffects[E](lifecycle: ApplicationLifecycle, events: EffectsEventsStream)(implicit ct: ClassTag[E]) {
  lazy val effects: ActorRef = null

  events.stream.subscribe(effects, classTag[E].runtimeClass)

  lifecycle.addStopHook { () =>
    Future.successful(events.stream.unsubscribe(effects))
  }
}
