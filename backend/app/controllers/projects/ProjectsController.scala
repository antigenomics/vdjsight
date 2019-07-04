package controllers.projects

import actions.{SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import controllers.projects.dto._
import controllers.{ControllerHelpers, WithRecoverAction}
import models.project.{ProjectLinkDTO, ProjectLinkProvider, ProjectProvider}
import models.user.{UserPermissionsProvider, UserProvider}
import org.slf4j.{Logger, LoggerFactory}
import play.api.i18n.{Lang, Messages, MessagesApi}
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ProjectsController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi)(
  implicit ec: ExecutionContext,
  up: UserProvider,
  upp: UserPermissionsProvider,
  pp: ProjectProvider,
  plp: ProjectLinkProvider
) extends AbstractController(cc) {

  implicit final private val logger: Logger     = LoggerFactory.getLogger(this.getClass)
  implicit final private val messages: Messages = messagesAPI.preferred(Seq(Lang.defaultLang))

  private def projectsAction[A](bodyParser: BodyParser[A])(block: SessionRequest[A] => Future[Result]) =
    WithRecoverAction {
      (session andThen session.authorizedOnly)(bodyParser).async(block)
    }

  private def projectsActionWithValidate[J](
    error: String = "Request validation failed"
  )(block: (SessionRequest[JsValue], J) => Future[Result])(implicit reads: Reads[J]) = projectsAction(parse.json) { implicit request =>
    ControllerHelpers.validateRequest[J](error) { value =>
      block(request, value)
    }
  }

  def list: Action[Unit] = projectsAction(parse.empty) { implicit request =>
    plp.findForUserWithProject(request.userID.get).map { projects =>
      Ok(ServerResponse(ProjectsListResponse(projects.map(lwp => ProjectLinkDTO.from(lwp._1, lwp._2)))))
    }
  }

  def create: Action[JsValue] = projectsActionWithValidate[ProjectsCreateRequest]() { (request, create) =>
    upp.findForUser(request.userID.get) flatMap {
      case Some(permissions) =>
        pp.findForOwner(request.userID.get) flatMap { projects =>
          if (projects.length >= permissions.maxProjectsCount) {
            Future(BadRequest(ServerResponseError("Too many projects")))
          } else {
            pp.create(request.userID.get, create.name, create.description) flatMap { project =>
              plp.create(request.userID.get, project.uuid).map { link =>
                Ok(ServerResponse(ProjectsCreateResponse(ProjectLinkDTO.from(link, project))))
              }
            }
          }
        }
      case None => Future(BadRequest(ServerResponseError("User does not exist")))
    }
  }

  def update: Action[JsValue] = projectsActionWithValidate[ProjectsUpdateRequest]() { (request, update) =>
    plp.get(update.uuid) flatMap {
      case Some(link) =>
        if (link.userID == request.userID.get && link.isModificationAllowed) {
          pp.update(link.projectID, update.name, update.description) map { project =>
            Ok(ServerResponse(ProjectsUpdateResponse(ProjectLinkDTO.from(link, project))))
          }
        } else {
          Future(Forbidden(ServerResponseError("You are not allowed to do this")))
        }
      case None => Future(BadRequest(ServerResponseError("Invalid request")))
    }
  }

  def delete: Action[JsValue] = projectsActionWithValidate[ProjectsDeleteRequest]() { (request, delete) =>
    plp.get(delete.uuid).flatMap {
      case Some(link) =>
        if (link.userID == request.userID.get) {
          if (delete.force) {
            plp.delete(link.uuid)
            Future(Ok(ServerResponse.EMPTY))
          } else {
            Future(NotImplemented(ServerResponseError("Scheduled delete not implemented yet")))
          }
        } else {
          Future(Forbidden(ServerResponseError("You are not allowed to do this")))
        }
      case _ => Future(BadRequest(ServerResponseError("Invalid request")))
    }
  }

}
