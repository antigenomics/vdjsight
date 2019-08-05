package controllers.analysis

import java.io.{FileInputStream, FileOutputStream}
import java.nio.ByteBuffer
import java.nio.file.{Files, Paths}
import java.util.UUID

import actions.{SessionRequest, SessionRequestAction}
import analysis.clonotypes.LiteClonotypeTable
import boopickle.Default._
import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.segment.Gene
import com.antigenomics.mir.{CommonUtils, Species}
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
import server.ServerResponse

import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._

class AnalysisController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi)(
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
      case Some(sampleFile) =>
        val clonotypesStream = ClonotypeTableParserUtils.streamFrom(
          CommonUtils.getFileAsStream(sampleFile.locations.sample, sampleFile.extension == ".gz"),
          Software.VDJtools,
          Species.Human,
          Gene.TRA
        )

        val parsed = new ClonotypeTable(clonotypesStream)
        val table = LiteClonotypeTable.from(parsed)

        val data = Pickle.intoBytes(table)

        println(table.rows.headOption.map(_.cdr3aa))

        val fc = new FileOutputStream("/tmp/dump-test").getChannel
        fc.write(data)
        fc.close()

        val ic = new FileInputStream("/tmp/dump-test").getChannel

        val bb = ByteBuffer.wrap(Files.readAllBytes(Paths.get("/tmp/dump-test")))

        val d: LiteClonotypeTable = Unpickle[LiteClonotypeTable].fromBytes(bb)

        println(d.rows.headOption.map(_.cdr3aa))

        // BufferPool.release(data)

        Future(Ok(ServerResponse(AnalysisClonotypesResponse(Seq("")))))
      case None => Future(BadRequest(ServerResponse("Sample does not exist")))
    }

  }

}
