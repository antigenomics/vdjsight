package effects

import java.nio.file.{Files, Path}

import akka.actor.{Actor, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectPermissionProviderEvent, ProjectPermissionProviderEvents}
import play.api.inject.ApplicationLifecycle

object ProjectPermissionsEffectsActor {
  def props(): Props = Props(new ProjectPermissionsEffectsActor())
}

class ProjectPermissionsEffectsActor() extends Actor {
  override def receive: Receive = {
    case ProjectPermissionProviderEvents.ProjectPermissionCreated(permission) =>
      Files.createDirectories(Path.of(permission.folder))
  }
}

@Singleton
class ProjectPermissionsEffects @Inject()(lifecycle: ApplicationLifecycle, events: EffectsEventsStream)
    extends AbstractEffects[ProjectPermissionProviderEvent](lifecycle, events) {
  
  final override lazy val effects = events.actorSystem.actorOf(ProjectPermissionsEffectsActor.props(), "project-permissions-effects-actor")
}
