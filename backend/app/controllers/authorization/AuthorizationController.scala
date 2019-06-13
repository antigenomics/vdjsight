package controllers.authorization

import actions.{SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import controllers.ControllerHelpers
import controllers.authorization.requests._
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.UserProvider
import org.slf4j.{Logger, LoggerFactory}
import play.api.i18n._
import play.api.libs.json.JsValue
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class AuthorizationController @Inject()(cc: ControllerComponents, sessionAction: SessionRequestAction, messagesAPI: MessagesApi, up: UserProvider)(
    implicit ec: ExecutionContext,
    vtp: VerificationTokenProvider,
    rtp: ResetTokenProvider)
    extends AbstractController(cc) {

  private implicit final val logger: Logger     = LoggerFactory.getLogger(this.getClass)
  private implicit final val messages: Messages = messagesAPI.preferred(Seq(Lang.defaultLang))

  def login: Action[JsValue] = (sessionAction andThen sessionAction.unauthorizedOnly)(parse.json).async { implicit request =>
    ControllerHelpers.validateRequestWithRecover[AuthorizationLoginRequest](error = AuthorizationLoginRequest.failedValidationMessage) { login =>
      up.getByEmailAndPassword(login.email, login.password).map {
        case None => BadRequest(ServerResponseError(messages("authorization.login.failed.email")))
        case Some(user) =>
          if (user.verified) {
            Ok(ServerResponse.EMPTY).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> user.uuid.toString)
          } else {
            BadRequest(ServerResponseError(messages("authorization.login.failed.unverified")))
          }
      }
    }
  }

  def signup: Action[JsValue] = (sessionAction andThen sessionAction.unauthorizedOnly)(parse.json).async { implicit request =>
    ControllerHelpers.validateRequestWithRecover[AuthorizationSignupRequest](error = AuthorizationSignupRequest.failedValidationMessage) { signup =>
      up.isUserWithEmailOrLoginExist(signup.email, signup.login).flatMap {
        case (isExistWithEmail, isExistWithLogin) =>
          if (isExistWithEmail) {
            Future.successful(BadRequest(ServerResponseError(messages("authorization.signup.validation.email.exist"))))
          } else if (isExistWithLogin) {
            Future.successful(BadRequest(ServerResponseError(messages("authorization.signup.validation.login.exist"))))
          } else {
            up.create(signup.login, signup.email, signup.password1) map { _ =>
              Ok(ServerResponse.MESSAGE(messages("authorization.signup.success")))
            }
          }
      }
    }
  }

  def beforeReset: Action[JsValue] = (sessionAction andThen sessionAction.unauthorizedOnly)(parse.json).async { implicit request =>
    ControllerHelpers.validateRequestWithRecover[AuthorizationBeforeResetRequest](error = AuthorizationBeforeResetRequest.failedValidationMessage) { reset =>
      up.getByEmail(reset.email).map { user =>
        user.foreach(u => rtp.create(u.uuid))
        Ok(ServerResponse.MESSAGE(messages("authorization.before-reset.success")))
      }
    }
  }

  def reset: Action[JsValue] = (sessionAction andThen sessionAction.unauthorizedOnly)(parse.json).async { implicit request =>
    ControllerHelpers.validateRequestWithRecover[AuthorizationResetRequest](error = AuthorizationResetRequest.failedValidationMessage) { reset =>
      up.reset(reset.token, reset.password1).map {
        case Some(_) => Ok(ServerResponse.MESSAGE(messages("authorization.reset.success")))
        case None    => BadRequest(ServerResponseError("Invalid reset token provided"))
      }
    }
  }

  def verify: Action[JsValue] = (sessionAction andThen sessionAction.unauthorizedOnly)(parse.json).async { implicit request =>
    ControllerHelpers.validateRequestWithRecover[AuthorizationVerifyRequest]() { verify =>
      up.verify(verify.token).map {
        case Some(_) => Ok(ServerResponse.MESSAGE(messages("authorization.verify.success")))
        case None    => BadRequest(ServerResponseError("Invalid verification token provided"))
      }
    }
  }

  def logout: Action[AnyContent] = Action {
    Ok(ServerResponse.EMPTY).withNewSession
  }

}
