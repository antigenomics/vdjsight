package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.sample.{SampleFileLinkProvider, SampleFileLinkProviderEvent, SampleFileLinkProviderEvents, SampleFileProvider}
import play.api.Logging
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

object SampleFileLinkEffectsActor {

  def props(sampleFileProvider: SampleFileProvider, sampleFileLinkProvider: SampleFileLinkProvider)(implicit ec: ExecutionContext): Props = {
    Props(new SampleFileLinkEffectsActor(sampleFileProvider, sampleFileLinkProvider))
  }
}

class SampleFileLinkEffectsActor(sampleFileProvider: SampleFileProvider, sampleFileLinkProvider: SampleFileLinkProvider)(
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
            sampleFileProvider.delete(link.sampleID)
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
  sampleFileLinkProvider: SampleFileLinkProvider
)(
  implicit ec: ExecutionContext
) extends AbstractEffects[SampleFileLinkProviderEvent](lifecycle, events) {

  final override lazy val effects =
    events.actorSystem.actorOf(SampleFileLinkEffectsActor.props(sampleFileProvider, sampleFileLinkProvider), "sample-file-link-effects-actor")
}
