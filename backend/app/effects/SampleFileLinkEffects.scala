package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.cache.AnalysisCacheProvider
import models.sample.{SampleFileLinkProvider, SampleFileLinkProviderEvent, SampleFileLinkProviderEvents, SampleFileProvider}
import play.api.Logging
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

object SampleFileLinkEffectsActor {

  def props(
    sampleFileProvider: SampleFileProvider,
    sampleFileLinkProvider: SampleFileLinkProvider,
    analysisCacheProvider: AnalysisCacheProvider
  )(
    implicit ec: ExecutionContext
  ): Props = {
    Props(new SampleFileLinkEffectsActor(sampleFileProvider, sampleFileLinkProvider, analysisCacheProvider))
  }
}

class SampleFileLinkEffectsActor(
  sampleFileProvider: SampleFileProvider,
  sampleFileLinkProvider: SampleFileLinkProvider,
  analysisCacheProvider: AnalysisCacheProvider
)(
  implicit ec: ExecutionContext
) extends Actor
    with Logging {
  override def receive: Receive = {
    case SampleFileLinkProviderEvents.SampleFileLinkProviderInitialized(_) =>
    case SampleFileLinkProviderEvents.SampleFileLinkCreated(_)             =>
    case SampleFileLinkProviderEvents.SampleFileLinkDeleted(link) =>
      sampleFileLinkProvider.findForSample(link.sampleID) onComplete {
        case Success(links) =>
          if (links.isEmpty) {
            analysisCacheProvider.findForSampleFile(link.sampleID).map(a => analysisCacheProvider.delete(a.map(_.uuid))) flatMap { _ =>
              sampleFileProvider.delete(link.sampleID)
            } onComplete {
              case Failure(exception) =>
                logger.error("Failed to apply SampleFileLinkDeleted effect from SampleFileLinkEffectsActor", exception)
              case _ =>
            }
          }
        case Failure(exception) =>
          logger.error("Failed to apply SampleFileLinkDeleted effect from SampleFileLinkEffectsActor", exception)
      }
  }
}

@Singleton
class SampleFileLinkEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  events: EffectsEventsStream,
  sampleFileProvider: SampleFileProvider,
  sampleFileLinkProvider: SampleFileLinkProvider,
  analysisCacheProvider: AnalysisCacheProvider
)(
  implicit ec: ExecutionContext
) extends AbstractEffects[SampleFileLinkProviderEvent](lifecycle, events) {

  final override lazy val effects =
    events.actorSystem
      .actorOf(SampleFileLinkEffectsActor.props(sampleFileProvider, sampleFileLinkProvider, analysisCacheProvider), "sample-file-link-effects-actor")
}
