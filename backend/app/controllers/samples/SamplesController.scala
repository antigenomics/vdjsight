package controllers.samples

import java.nio.file.Paths
import java.util.UUID

import actions.{SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import controllers.samples.dto.{SamplesCreateRequest, SamplesCreateResponse, SamplesDeleteRequest, SamplesListResponse}
import controllers.{ControllerHelpers, WithRecoverAction}
import models.project.{ProjectLink, ProjectLinkProvider, ProjectProvider}
import models.sample.{SampleFileLinkDTO, SampleFileLinkProvider, SampleFileProvider}
import models.user.{UserPermissionsProvider, UserProvider}
import play.api.Logging
import play.api.i18n.{Lang, Messages, MessagesApi}
import play.api.libs.Files
import play.api.libs.json.{JsValue, Reads}
import play.api.mvc._
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class SamplesController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi)(
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

  private def checkProject[I, R, L](projectLinkUUID: UUID)(block: ProjectLink => Future[Result])(implicit request: SessionRequest[L]) =
    projectsLinkProvider.get(projectLinkUUID) flatMap {
      case Some(link) if link.userID == request.userID.get => block(link)
      case Some(link) if link.userID != request.userID.get => Future(BadRequest(ServerResponse("Bad credentials")))
      case None                                            => Future(BadRequest(ServerResponse("Project does not exist")))
    }

  private def action[A](bodyParser: BodyParser[A], projectLinkUUID: UUID)(block: (SessionRequest[A], ProjectLink) => Future[Result]) =
    WithRecoverAction {
      (session andThen session.authorizedOnly)(bodyParser).async { implicit request =>
        checkProject(projectLinkUUID) { link =>
          block(request, link)
        }
      }
    }

  private def actionWithValidate[J](
    projectLinkUUID: UUID,
    error: String = "Request validation failed"
  )(block: (SessionRequest[JsValue], J, ProjectLink) => Future[Result])(implicit reads: Reads[J]) =
    action(parse.json, projectLinkUUID) { (request, link) =>
      implicit val rjs: Request[JsValue] = request
      ControllerHelpers.validateRequest[J](error) { value =>
        block(request, value, link)
      }
    }

  private def uploadAction(projectLinkUUID: UUID)(block: (SessionRequest[MultipartFormData[Files.TemporaryFile]], ProjectLink) => Future[Result]) =
    WithRecoverAction {
      (session andThen session.authorizedOnly andThen checkUploadAllowed(projectLinkUUID))(
        parse.multipartFormData(sampleFileProvider.configuration.maxSampleSize)
      ).async { implicit request =>
        checkProject(projectLinkUUID) { link =>
          block(request, link)
        }
      }
    }

  def checkUploadAllowed(projectLinkUUID: UUID)(implicit ec: ExecutionContext): ActionFilter[SessionRequest] = new ActionFilter[SessionRequest] {
    override protected def executionContext: ExecutionContext = ec

    override protected def filter[A](request: SessionRequest[A]): Future[Option[Result]] = {
      projectsLinkProvider.get(projectLinkUUID).map(_.exists(_.isUploadAllowed)).flatMap {
        case true =>
          userPermissionsProvider.findForUser(request.userID.get).flatMap {
            case Some((permissions, _)) if permissions.maxSamplesCount <= 0 => Future(None)
            case Some((permissions, _)) if permissions.maxSamplesCount > 0 =>
              sampleFileProvider.findForOwner(request.userID.get).map { samples =>
                if (samples.length >= permissions.maxSamplesCount) {
                  Some(Forbidden(ServerResponseError("Max files count limit has been exceeded")))
                } else {
                  None
                }
              }
            case None => Future(Some(Forbidden(ServerResponseError("Internal Server Error"))))
          }
        case false => Future(Some(Forbidden(ServerResponseError("You are not allowed to do this"))))
      }
    }
  }

  def list(projectLinkUUID: UUID): Action[Unit] = action(parse.empty, projectLinkUUID) { (_, projectLink) =>
    sampleFileLinkProvider.findForProjectWithSample(projectLink.projectID) map { samples =>
      Ok(ServerResponse(SamplesListResponse(samples.map(lws => SampleFileLinkDTO.from(lws, projectLink)))))
    }
  }

  def create(projectLinkUUID: UUID): Action[MultipartFormData[Files.TemporaryFile]] = uploadAction(projectLinkUUID) { (request, projectLink) =>
    SamplesCreateRequest.samplesUploadRequestMapping
      .bindFromRequest()(request)
      .fold(
        formWithErrors => Future(BadRequest(ServerResponseError(s"${formWithErrors.errors.head.key} : ${messages(formWithErrors.errors.head.message)}"))),
        form =>
          request.body.file("file").fold(Future(BadRequest(ServerResponseError("File is empty")))) { file =>
            if (file.fileSize != form.size) {
              Future(BadRequest(ServerResponseError("Bad file")))
            } else {
              sampleFileProvider.create(request.userID.get, form.name, form.software, form.species, form.gene, form.size, form.extension, form.hash) flatMap {
                created =>
                  file.ref.copyTo(Paths.get(created.locations.sample), replace = true)
                  sampleFileProvider.markAsUploaded(created.uuid) flatMap { uploaded =>
                    sampleFileLinkProvider.create(uploaded.uuid, projectLink.projectID) map { link =>
                      Ok(ServerResponse(SamplesCreateResponse(SampleFileLinkDTO.from(link, uploaded, projectLink))))
                    }
                  }
              }
            }
          }
      )
  }

  def delete(projectLinkUUID: UUID): Action[JsValue] = actionWithValidate[SamplesDeleteRequest](projectLinkUUID) { (_, delete, projectLink) =>
    if (projectLink.isDeleteAllowed) {
      sampleFileLinkProvider.get(delete.uuid).flatMap {
        case Some(link) if link.projectID == projectLink.projectID && delete.force =>
          sampleFileLinkProvider.delete(link.uuid)
          Future(Ok(ServerResponse.EMPTY))
        case Some(link) if link.projectID == projectLink.projectID && !delete.force =>
          Future(NotImplemented(ServerResponseError("Scheduled delete not implemented yet")))
        case Some(link) if link.projectID != projectLink.projectID => Future(BadRequest(ServerResponse("Bad credentials")))
        case None                                                  => Future(BadRequest(ServerResponseError("Invalid request")))
      }
    } else {
      Future(BadRequest(ServerResponseError("You are not allowed to do this")))
    }
  }

}
