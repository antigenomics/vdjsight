package controllers.projects.overview

import actions.{SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import controllers.projects.overview.dto.{ProjectsOverviewCreateRequest, ProjectsOverviewCreateResponse, ProjectsOverviewListResponse}
import controllers.{ControllerHelpers, WithRecoverAction}
import models.project.{ProjectLinkDTO, ProjectLinkProvider, ProjectProvider}
import models.user.UserProvider
import org.slf4j.{Logger, LoggerFactory}
import play.api.i18n.{Lang, Messages, MessagesApi}
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import server.ServerResponse

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ProjectsOverviewController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi)(
  implicit ec: ExecutionContext,
  up: UserProvider,
  pp: ProjectProvider,
  plp: ProjectLinkProvider
) extends AbstractController(cc) {

  implicit final private val logger: Logger     = LoggerFactory.getLogger(this.getClass)
  implicit final private val messages: Messages = messagesAPI.preferred(Seq(Lang.defaultLang))

  private def projectsOverviewAction(block: SessionRequest[JsValue] => Future[Result]) =
    WithRecoverAction {
      (session andThen session.authorizedOnly)(parse.json).async(block)
    }

  private def projectsOverviewActionWithValidate[J](
    error: String = "Request validation failed"
  )(block: (SessionRequest[JsValue], J) => Future[Result])(implicit reads: Reads[J]) = projectsOverviewAction { implicit request =>
    ControllerHelpers.validateRequest[J](error) { value =>
      block(request, value)
    }
  }

  def list: Action[JsValue] = projectsOverviewAction { implicit request =>
    plp.findForUserWithProject(request.userID.get).map { projects =>
      Ok(ServerResponse(ProjectsOverviewListResponse(projects.map(ProjectLinkDTO(_)))))
    }
  }

  def create: Action[JsValue] = projectsOverviewActionWithValidate[ProjectsOverviewCreateRequest]() { (request, create) =>
    pp.create(request.userID.get, create.name, create.description) flatMap { project =>
      plp.create(request.userID.get, project.uuid).map { link =>
        Ok(ServerResponse(ProjectsOverviewCreateResponse(ProjectLinkDTO(link, project))))
      }
    }
  }

}
