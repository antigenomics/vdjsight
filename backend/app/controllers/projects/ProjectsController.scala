package controllers.projects

import java.util.UUID

import actions.{SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import controllers.projects.dto._
import controllers.{ControllerHelpers, WithRecoverAction}
import models.project.{ProjectLinkDTO, ProjectLinkProvider, ProjectProvider}
import models.user.{UserPermissionsProvider, UserProvider}
import play.api.Logging
import play.api.i18n.{Lang, Messages, MessagesApi}
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ProjectsController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi)(
  implicit ec: ExecutionContext,
  userProvider: UserProvider,
  userPermissionsProvider: UserPermissionsProvider,
  projectsProvider: ProjectProvider,
  projectsLinkProvider: ProjectLinkProvider
) extends AbstractController(cc)
    with Logging {

  implicit final private val messages: Messages = messagesAPI.preferred(Seq(Lang.defaultLang))

  private def action[A](bodyParser: BodyParser[A])(block: SessionRequest[A] => Future[Result]) =
    WithRecoverAction {
      (session andThen session.authorizedOnly)(bodyParser).async(block)
    }

  private def actionWithValidate[J](
    error: String = "Request validation failed"
  )(block: (SessionRequest[JsValue], J) => Future[Result])(implicit reads: Reads[J]) = action(parse.json) { implicit request =>
    ControllerHelpers.validateRequest[J](error) { value =>
      block(request, value)
    }
  }

  def info(projectLinkUUID: UUID): Action[Unit] = action(parse.empty) { implicit request =>
    projectsLinkProvider.getWithProject(projectLinkUUID) map {
      case Some(lwp) if lwp._1.userID == request.userID.get => Ok(ServerResponse(ProjectLinkDTO.from(lwp)))
      case Some(lwp) if lwp._1.userID != request.userID.get => Forbidden(ServerResponseError("You are not allowed to do this"))
      case None                                             => BadRequest(ServerResponseError("Invalid request"))
    }
  }

  def list: Action[Unit] = action(parse.empty) { implicit request =>
    projectsLinkProvider.findForUserWithProject(request.userID.get).map { projects =>
      Ok(ServerResponse(ProjectsListResponse(projects.map(lwp => ProjectLinkDTO.from(lwp)))))
    }
  }

  def create: Action[JsValue] = actionWithValidate[ProjectsCreateRequest]() { (request, create) =>
    projectsProvider.create(request.userID.get, create.name, create.description) flatMap { project =>
      projectsLinkProvider.create(request.userID.get, project.uuid).map { link =>
        Ok(ServerResponse(ProjectsCreateResponse(ProjectLinkDTO.from(link, project))))
      }
    }
  }

  def update: Action[JsValue] = actionWithValidate[ProjectsUpdateRequest]() { (request, update) =>
    projectsLinkProvider.get(update.uuid) flatMap {
      case Some(link) if link.userID == request.userID.get && link.isModificationAllowed =>
        projectsProvider.update(link.projectID, update.name, update.description) map { project =>
          Ok(ServerResponse(ProjectsUpdateResponse(ProjectLinkDTO.from(link, project))))
        }
      case Some(link) if link.userID != request.userID.get || !link.isModificationAllowed =>
        Future(Forbidden(ServerResponseError("You are not allowed to do this")))
      case None => Future(BadRequest(ServerResponseError("Invalid request")))
    }
  }

  def delete: Action[JsValue] = actionWithValidate[ProjectsDeleteRequest]() { (request, delete) =>
    projectsLinkProvider.get(delete.uuid).flatMap {
      case Some(link) if link.userID == request.userID.get && delete.force =>
        projectsLinkProvider.delete(link.uuid)
        Future(Ok(ServerResponse.EMPTY))
      case Some(link) if link.userID == request.userID.get && !delete.force =>
        Future(NotImplemented(ServerResponseError("Scheduled delete not implemented yet")))
      case Some(link) if link.userID != request.userID.get => Future(Forbidden(ServerResponseError("You are not allowed to do this")))
      case _                                               => Future(BadRequest(ServerResponseError("Invalid request")))
    }
  }

}
