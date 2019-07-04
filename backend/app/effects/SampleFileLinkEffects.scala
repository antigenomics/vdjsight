package effects

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.sample.{SampleFileLinkProvider, SampleFileLinkProviderEvent, SampleFileLinkProviderEvents, SampleFileProvider}
import play.api.Logging
import play.api.inject.ApplicationLifecycle

import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

object SampleFileLinkEffectsActor {
  def props(sfp: SampleFileProvider, sflp: SampleFileLinkProvider)(implicit ec: ExecutionContext): Props = Props(new SampleFileLinkEffectsActor(sfp, sflp))
}

class SampleFileLinkEffectsActor(sfp: SampleFileProvider, sflp: SampleFileLinkProvider)(implicit ec: ExecutionContext) extends Actor with Logging {
  override def receive: Receive = {
    case SampleFileLinkProviderEvents.SampleFileLinkProviderInitialized(_) =>
    case SampleFileLinkProviderEvents.SampleFileLinkCreated(_)             =>
    case SampleFileLinkProviderEvents.SampleFileLinkDeleted(link) =>
      sflp.findForSample(link.sampleID) onComplete {
        case Success(links) =>
          if (links.isEmpty) {
            sfp.delete(link.sampleID)
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
  sfp: SampleFileProvider,
  sflp: SampleFileLinkProvider
)(
  implicit ec: ExecutionContext
) extends AbstractEffects[SampleFileLinkProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(SampleFileLinkEffectsActor.props(sfp, sflp), "sample-file-link-effects-actor")
}
