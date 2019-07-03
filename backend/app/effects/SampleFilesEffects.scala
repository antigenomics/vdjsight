package effects

import java.nio.file.{Files, Paths}

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.sample.{SampleFileProviderEvent, SampleFileProviderEvents}
import play.api.Logging
import play.api.inject.ApplicationLifecycle

object SampleFileEffectsActor {
  def props(): Props = Props(new SampleFileEffectsActor())
}

class SampleFileEffectsActor extends Actor with Logging {
  override def receive: Receive = {
    case SampleFileProviderEvents.SampleFileProviderInitialized(configuration) =>
      if (!Files.exists(Paths.get(configuration.storagePath))) {
        logger.info("Initializing samples storage folder")
        Files.createDirectories(Paths.get(configuration.storagePath))
      }
    case SampleFileProviderEvents.SampleFileCreated(sample) => Files.createDirectories(Paths.get(sample.folder))
    case SampleFileProviderEvents.SampleFileUpdated(_)      =>
    case SampleFileProviderEvents.SampleFileDeleted(sample) => Files.deleteIfExists(Paths.get(sample.folder))
  }
}

@Singleton
class SampleFilesEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream)
    extends AbstractEffects[SampleFileProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(SampleFileEffectsActor.props(), "sample-files-effects-actor")
}
