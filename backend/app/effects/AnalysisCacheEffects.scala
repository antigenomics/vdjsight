package effects

import java.nio.file.{Files, Paths}

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.cache.{AnalysisCacheExpiredAction, AnalysisCacheProvider, AnalysisCacheProviderEvent, AnalysisCacheProviderEvents}
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext

object AnalysisCacheEffectsActor {

  def props(analysisCacheProvider: AnalysisCacheProvider)(implicit ec: ExecutionContext): Props =
    Props(new AnalysisCacheEffectsActor(analysisCacheProvider))
}

class AnalysisCacheEffectsActor(analysisCacheProvider: AnalysisCacheProvider)(implicit ec: ExecutionContext) extends Actor {
  override def receive: Receive = {
    case AnalysisCacheProviderEvents.AnalysisCacheCreated(_)   =>
    case AnalysisCacheProviderEvents.AnalysisCacheTouch(cache) => analysisCacheProvider.touch(cache.uuid)
    case AnalysisCacheProviderEvents.AnalysisCacheTouched(_)   =>
    case AnalysisCacheProviderEvents.AnalysisCacheDeleted(cache) =>
      cache.expiredAction match {
        case AnalysisCacheExpiredAction.DELETE_FILE => Files.deleteIfExists(Paths.get(cache.cache))
        case AnalysisCacheExpiredAction.NOTHING     =>
      }
  }
}

@Singleton
class AnalysisCacheEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  events: EffectsEventsStream,
  analysisCacheProvider: AnalysisCacheProvider
)(implicit ec: ExecutionContext)
    extends AbstractEffects[AnalysisCacheProviderEvent](lifecycle, events) {
  final override lazy val effects = events.actorSystem.actorOf(AnalysisCacheEffectsActor.props(analysisCacheProvider), "analysis-cache-effects-actor")
}
