package controllers.analysis

import java.io.{FileInputStream, FileOutputStream}
import java.nio.ByteBuffer
import java.util.UUID
import java.util.zip.{GZIPInputStream, GZIPOutputStream}

import actions.{SessionRequest, SessionRequestAction}
import analysis.clonotypes.{ClonotypeTableAnalysis, LiteClonotypeTable, LiteClonotypeTablePage}
import boopickle.BufferPool
import boopickle.Default._
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.segment.Gene
import com.antigenomics.mir.{CommonUtils, Species}
import com.google.inject.Inject
import controllers.analysis.dto.{AnalysisClonotypesRequest, AnalysisClonotypesResponse}
import controllers.{ControllerHelpers, WithRecoverAction}
import models.cache.{AnalysisCacheExpiredAction, AnalysisCacheProvider}
import models.project.{ProjectLink, ProjectLinkProvider, ProjectProvider}
import models.sample.{SampleFileLink, SampleFileLinkProvider, SampleFileProvider}
import models.user.{UserPermissionsProvider, UserProvider}
import play.api.Logging
import play.api.i18n.{Lang, Messages, MessagesApi}
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import server.ServerResponse

import scala.concurrent.{ExecutionContext, Future}

class AnalysisController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi)(
  implicit
  ec: ExecutionContext,
  userProvider: UserProvider,
  userPermissionsProvider: UserPermissionsProvider,
  projectsProvider: ProjectProvider,
  projectsLinkProvider: ProjectLinkProvider,
  sampleFileProvider: SampleFileProvider,
  sampleFileLinkProvider: SampleFileLinkProvider,
  analysisCacheProvider: AnalysisCacheProvider
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
                Future(BadRequest(ServerResponse("Bad credentials: SampleLink does not belong to project")))
              case None => Future(BadRequest(ServerResponse("Sample does not exist")))
            }
          case Some(pLink) if pLink.userID != request.userID.get => Future(BadRequest(ServerResponse("Bad credentials: ProjectLink does not belong to user")))
          case None                                              => Future(BadRequest(ServerResponse("Sample does not exist")))
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

  def clonotypes(pLinkUUID: UUID, sLinkUUID: UUID) = actionWithValidate[AnalysisClonotypesRequest](pLinkUUID, sLinkUUID) { (req, clonotypes, pLink, sLink) =>
    sampleFileProvider.get(sLink.sampleID) flatMap {
      case Some(sampleFile) => ClonotypeTableAnalysis.clonotypes(sampleFile, "default") map { table =>
        Ok(ServerResponse(LiteClonotypeTablePage(1, 20, table.rows.slice(0, 20))))
      }
      case None => Future(BadRequest(ServerResponse("Sample does not exist")))
    }

  }

}
