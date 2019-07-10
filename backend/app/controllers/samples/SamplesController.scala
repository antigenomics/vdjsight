package controllers.samples

import java.util.UUID

import actions.{SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import controllers.samples.dto.SamplesListResponse
import controllers.{ControllerHelpers, WithRecoverAction}
import models.project.{ProjectLink, ProjectLinkProvider, ProjectProvider}
import models.sample.{SampleFileLinkDTO, SampleFileLinkProvider, SampleFileProvider}
import models.user.{UserPermissionsProvider, UserProvider}
import play.api.Logging
import play.api.i18n.{Lang, Messages, MessagesApi}
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import server.ServerResponse

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class SamplesController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi)(
  implicit ec: ExecutionContext,
  userProvider: UserProvider,
  userPermissionsProvider: UserPermissionsProvider,
  projectsProvider: ProjectProvider,
  projectsLinkProvider: ProjectLinkProvider,
  sampleFileProvider: SampleFileProvider,
  sampleFileLinkProvider: SampleFileLinkProvider
) extends AbstractController(cc)
    with Logging {

  implicit final private val messages: Messages = messagesAPI.preferred(Seq(Lang.defaultLang))

  private def samplesAction[A](bodyParser: BodyParser[A], projectLinkUUID: UUID)(block: (SessionRequest[A], ProjectLink) => Future[Result]) =
    WithRecoverAction {
      (session andThen session.authorizedOnly)(bodyParser).async { implicit request =>
        projectsLinkProvider.get(projectLinkUUID) flatMap {
          case Some(link) =>
            if (link.userID == request.userID.get) {
              block(request, link)
            } else {
              Future(BadRequest(ServerResponse("Bad credentials")))
            }
          case None => Future(BadRequest(ServerResponse("Project does not exist")))
        }
      }
    }

  private def samplesActionWithValidate[J](
    projectLinkUUID: UUID,
    error: String = "Request validation failed"
  )(block: (SessionRequest[JsValue], J, ProjectLink) => Future[Result])(implicit reads: Reads[J]) = samplesAction(parse.json, projectLinkUUID) {
    (request, link) =>
      {
        implicit val rjs: Request[JsValue] = request
        ControllerHelpers.validateRequest[J](error) { value =>
          block(request, value, link)
        }
      }
  }

  def list(projectLinkUUID: UUID): Action[Unit] = samplesAction(parse.empty, projectLinkUUID) { (_, projectLink) =>
    sampleFileLinkProvider.findForProjectWithSample(projectLinkUUID) map { samples =>
      Ok(ServerResponse(SamplesListResponse(samples.map(lws => SampleFileLinkDTO.from(lws, projectLink)))))
    }
  }

}
