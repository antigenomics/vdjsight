package controllers.analysis

import java.util.UUID

import actions.{SessionRequest, SessionRequestAction}
import analysis.clonotypes.ClonotypeTableAnalysisService
import com.google.inject.Inject
import controllers.analysis.dto.{AnalysisClonotypesRequest, AnalysisClonotypesResponse}
import controllers.{ControllerHelpers, WithRecoverAction}
import models.project.{ProjectLink, ProjectLinkProvider, ProjectProvider}
import models.sample.{SampleFileLink, SampleFileLinkProvider, SampleFileProvider}
import models.user.{UserPermissionsProvider, UserProvider}
import play.api.Logging
import play.api.i18n.{Lang, Messages, MessagesApi}
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Using}

class AnalysisController @Inject()(
  cc: ControllerComponents,
  session: SessionRequestAction,
  messagesAPI: MessagesApi,
  clonotypesAnalysis: ClonotypeTableAnalysisService
)(
  implicit
  ec: ExecutionContext,
  userProvider: UserProvider,
  userPermissionsProvider: UserPermissionsProvider,
  projectsProvider: ProjectProvider,
  projectsLinkProvider: ProjectLinkProvider,
  sampleFileProvider: SampleFileProvider,
  sampleFileLinkProvider: SampleFileLinkProvider
) extends AbstractController(cc)
    with Logging {

  implicit final private val messages: Messages = messagesAPI.preferred(Seq(Lang.defaultLang))

  private def action[A](bodyParser: BodyParser[A], projectLinkUUID: UUID, sampleLinkUUID: UUID)(
    block: (SessionRequest[A], ProjectLink, SampleFileLink) => Future[Result]
  ) =
    WithRecoverAction {
      (session andThen session.authorizedOnly)(bodyParser).async { implicit request =>
        projectsLinkProvider.get(projectLinkUUID) flatMap {
          case Some(pLink) if pLink.userID == request.userID.get =>
            sampleFileLinkProvider.get(sampleLinkUUID) flatMap {
              case Some(sLink) if sLink.projectID == pLink.projectID => block(request, pLink, sLink)
              case Some(sLink) if sLink.projectID != pLink.projectID =>
                Future.successful(BadRequest(ServerResponseError("Bad credentials: SampleLink does not belong to project")))
              case None => Future.successful(BadRequest(ServerResponseError("Sample does not exist")))
            }
          case Some(pLink) if pLink.userID != request.userID.get =>
            Future.successful(BadRequest(ServerResponseError("Bad credentials: ProjectLink does not belong to user")))
          case None => Future.successful(BadRequest(ServerResponseError("Sample does not exist")))
        }

      }
    }

  private def actionWithValidate[J](
    projectLinkUUID: UUID,
    sampleLinkUUID: UUID,
    error: String = "Request validation failed"
  )(block: (SessionRequest[JsValue], J, ProjectLink, SampleFileLink) => Future[Result])(implicit reads: Reads[J]) =
    action(parse.json, projectLinkUUID, sampleLinkUUID) { (request, pLink, sLink) =>
      implicit val rjs: Request[JsValue] = request
      ControllerHelpers.validateRequest[J](error) { value =>
        block(request, value, pLink, sLink)
      }
    }

  def clonotypes(pLinkUUID: UUID, sLinkUUID: UUID): Action[JsValue] = actionWithValidate[AnalysisClonotypesRequest](pLinkUUID, sLinkUUID) {
    (req, clonotypes, pLink, sLink) =>
      sampleFileProvider.get(sLink.sampleID) flatMap {
        case Some(sampleFile) =>
          clonotypesAnalysis.clonotypes(sampleFile, "default") map { table =>
            Using(table) { t =>
              val pages       = t.pages(clonotypes.page, clonotypes.pageSize)
              val pageNumbers = pages.map(_.page)
              val setPageTo = if (clonotypes.page < pageNumbers.min) {
                pageNumbers.min
              } else if (clonotypes.page > pageNumbers.max) {
                pageNumbers.max
              } else {
                clonotypes.page
              }
              ServerResponse(AnalysisClonotypesResponse(setPageTo, clonotypes.pageSize, pages))
            } match {
              case Success(response) => Ok(response)
              case Failure(ex) =>
                logger.error("Failed to create clonotype table", ex)
                BadRequest(ServerResponseError("Failed to create clonotype table"))
            }
          }
        case None => Future.successful(BadRequest(ServerResponseError("Sample does not exist")))
      }

  }

}
