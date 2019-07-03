package effects

import java.nio.file.{Files, Paths}

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectProviderEvent, ProjectProviderEvents}
import play.api.Logging
import play.api.inject.ApplicationLifecycle

object ProjectEffectsActor {
  def props(): Props = Props(new ProjectEffectsActor())
}

class ProjectEffectsActor() extends Actor with Logging {

  override def receive: Receive = {
    case ProjectProviderEvents.ProjectProviderInitialized(configuration) =>
      if (!Files.exists(Paths.get(configuration.storagePath))) {
        logger.info("[ProjectProvider] Initializing projects storage folder")
        Files.createDirectories(Paths.get(configuration.storagePath))
      }
    case ProjectProviderEvents.ProjectCreated(project) => Files.createDirectories(Paths.get(project.folder))
    case ProjectProviderEvents.ProjectUpdated(_)       =>
    case ProjectProviderEvents.ProjectDeleted(project) => Files.deleteIfExists(Paths.get(project.folder))
  }

}

@Singleton
class ProjectEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream) extends AbstractEffects[ProjectProviderEvent](lifecycle, events) {

  final override lazy val effects = events.actorSystem.actorOf(ProjectEffectsActor.props(), "projects-effects-actor")
}
