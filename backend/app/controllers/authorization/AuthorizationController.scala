package controllers.authorization

import java.util.concurrent.TimeUnit

import actions.{DelayedAction, SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import controllers.ControllerHelpers
import controllers.authorization.dto._
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.UserProvider
import org.slf4j.{Logger, LoggerFactory}
import play.api.i18n._
import play.api.libs.json.JsValue
import play.api.mvc._
import play.api.{ConfigLoader, Configuration}
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.language.postfixOps

case class AuthorizationControllerConfiguration(delay: Long)

object AuthorizationControllerConfiguration {
  implicit val authorizationControllerConfigurationLoader: ConfigLoader[AuthorizationControllerConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    AuthorizationControllerConfiguration(
      delay = config.getDuration("delay", TimeUnit.MILLISECONDS)
    )
  }
}

@Singleton
class AuthorizationController @Inject()(cc: ControllerComponents,
                                        sessionAction: SessionRequestAction,
                                        messagesAPI: MessagesApi,
                                        conf: Configuration,
                                        up: UserProvider)(implicit ec: ExecutionContext, vtp: VerificationTokenProvider, rtp: ResetTokenProvider)
    extends AbstractController(cc) {

  private implicit final val logger: Logger                                      = LoggerFactory.getLogger(this.getClass)
  private implicit final val messages: Messages                                  = messagesAPI.preferred(Seq(Lang.defaultLang))
  private implicit final val configuration: AuthorizationControllerConfiguration = conf.get[AuthorizationControllerConfiguration]("application.auth.controller")

  private def authorizationAction(block: SessionRequest[JsValue] => Future[Result]) = DelayedAction(configuration.delay milliseconds)(
    (sessionAction andThen sessionAction.unauthorizedOnly)(parse.json).async(block)
  )

  def login: Action[JsValue] = authorizationAction { implicit request =>
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

  def signup: Action[JsValue] = authorizationAction { implicit request =>
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

  def reset: Action[JsValue] = authorizationAction { implicit request =>
    ControllerHelpers.validateRequestWithRecover[AuthorizationResetRequest](error = AuthorizationResetRequest.failedValidationMessage) { reset =>
      up.getByEmail(reset.email).map { user =>
        user.foreach(u => rtp.create(u.uuid))
        Ok(ServerResponse.MESSAGE(messages("authorization.reset.success")))
      }
    }
  }

  def change: Action[JsValue] = authorizationAction { implicit request =>
    ControllerHelpers.validateRequestWithRecover[AuthorizationChangeRequest](error = AuthorizationChangeRequest.failedValidationMessage) { reset =>
      up.reset(reset.token, reset.password1).map {
        case Some(_) => Ok(ServerResponse.MESSAGE(messages("authorization.change.success")))
        case None    => BadRequest(ServerResponseError("Invalid reset token provided"))
      }
    }
  }

  def verify: Action[JsValue] = authorizationAction { implicit request =>
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
