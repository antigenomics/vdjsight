package effects

import java.nio.file.{Files, Path}

import akka.actor.{Actor, ActorSystem, Props}
import com.google.inject.{Inject, Singleton}
import models.project.{ProjectPermissionProviderEvent, ProjectPermissionProviderEvents, ProjectPermissionsProvider}
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
class ProjectPermissionsEffects @Inject()(
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  ppp: ProjectPermissionsProvider
) extends AbstractEffects[ProjectPermissionProviderEvent](lifecycle) {
  final override lazy val effects = actorSystem.actorOf(ProjectPermissionsEffectsActor.props(), "project-permissions-effects-actor")

  override def stream: EventStreaming[ProjectPermissionProviderEvent] = ppp
}
