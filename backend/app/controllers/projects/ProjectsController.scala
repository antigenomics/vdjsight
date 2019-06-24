package controllers.projects

import actions.{SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import controllers.projects.dto.{ProjectsCreateRequest, ProjectsCreateResponse, ProjectsDeleteRequest, ProjectsListResponse}
import controllers.{ControllerHelpers, WithRecoverAction}
import models.project.{ProjectLinkDTO, ProjectLinkProvider, ProjectProvider}
import models.user.UserProvider
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
      Ok(ServerResponse(ProjectsListResponse(projects.map(ProjectLinkDTO(_)))))
    }
  }

  def create: Action[JsValue] = projectsActionWithValidate[ProjectsCreateRequest]() { (request, create) =>
    pp.create(request.userID.get, create.name, create.description) flatMap { project =>
      plp.create(request.userID.get, project.uuid).map { link =>
        Ok(ServerResponse(ProjectsCreateResponse(ProjectLinkDTO(link, project))))
      }
    }
  }

  def delete: Action[JsValue] = projectsActionWithValidate[ProjectsDeleteRequest]() { (request, delete) =>
    plp.getWithUser(delete.id).flatMap {
      case Some((link, user)) =>
        if (user.uuid != request.userID.get) {
          Future(Forbidden(ServerResponseError("You are not allowed to delete this link")))
        } else {
          if (delete.force) {
            plp.delete(link.uuid)
          } else {
            plp.scheduleDelete(link.uuid)
          }
          Future(Ok(ServerResponse.EMPTY))
        }
      case _ => Future(BadRequest(ServerResponseError("Invalid request")))
    }
  }

}
