package controllers.authorization

import java.util.UUID

import actions.{SessionRequest, SessionRequestAction}
import controllers.ControllerHelpers
import javax.inject.Inject
import models.token.VerificationTokenProvider
import models.user.UserProvider
import org.slf4j.{Logger, LoggerFactory}
import play.api.i18n._
import play.api.libs.json.JsValue
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.{ExecutionContext, Future}

class AuthorizationController @Inject()(cc: ControllerComponents,
                                        sessionAction: SessionRequestAction,
                                        messagesAPI: MessagesApi,
                                        up: UserProvider,
                                        vtp: VerificationTokenProvider)(implicit ec: ExecutionContext)
    extends AbstractController(cc) {

  private final val logger: Logger = LoggerFactory.getLogger(this.getClass)

  implicit val messages: Messages = messagesAPI.preferred(Seq(Lang.defaultLang))

  def onLogin: Action[JsValue] = (sessionAction andThen sessionAction.unauthorizedOnly) { implicit request =>
    Ok(request.request.session.data.toString).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> UUID.randomUUID().toString)
  }

  def onSignup: Action[JsValue] = (sessionAction andThen sessionAction.unauthorizedOnly)(parse.json).async { implicit request =>
    ControllerHelpers.validateRequest[AuthorizationSignupRequest](error = "authorization.signup.validation.failed") { signup =>
      up.isUserWithEmailOrLoginExist(signup.email, signup.login).flatMap {
        case (isExistWithEmail, isExistWithLogin) =>
          if (isExistWithEmail) {
            Future.successful(BadRequest(ServerResponseError(messages("authorization.signup.validation.email.exist"))))
          } else if (isExistWithLogin) {
            Future.successful(BadRequest(ServerResponseError(messages("authorization.signup.validation.login.exist"))))
          } else {
            val result = for {
              userID <- up.create(signup.login, signup.email, signup.password1)
              _      <- vtp.create(userID)
              result <- Future.successful(Ok(ServerResponse.SUCCESS))
            } yield result

            result recover {
              case e: Exception =>
                logger.error(s"Server error with onSignup", e)
                InternalServerError(ServerResponseError("Cannot create user"))
            }

          }
      }
    }
  }

  def onLogout: Action[AnyContent] = Action {
    Ok(ServerResponseError("asd")).withNewSession
  }

}
