package controllers.authorization

import java.util.concurrent.TimeUnit

import actions.{DelayedAction, SessionRequest, SessionRequestAction}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import controllers.authorization.dto._
import controllers.{ControllerHelpers, WithRecoverAction}
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.UserProvider
import org.slf4j.{Logger, LoggerFactory}
import play.api.i18n._
import play.api.libs.json.{JsValue, Reads}
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
class AuthorizationController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi, conf: Configuration)(
  implicit ec: ExecutionContext,
  userProvider: UserProvider,
  verificationTokenProvider: VerificationTokenProvider,
  resetTokenProvider: ResetTokenProvider
) extends AbstractController(cc) {

  implicit final private val logger: Logger                                      = LoggerFactory.getLogger(this.getClass)
  implicit final private val messages: Messages                                  = messagesAPI.preferred(Seq(Lang.defaultLang))
  implicit final private val configuration: AuthorizationControllerConfiguration = conf.get[AuthorizationControllerConfiguration]("application.auth.controller")

  private def action[J](error: String = "Request validation failed")(block: (SessionRequest[JsValue], J) => Future[Result])(implicit reads: Reads[J]) =
    DelayedAction(configuration.delay milliseconds) {
      WithRecoverAction {
        (session andThen session.unauthorizedOnly)(parse.json).async { implicit request =>
          ControllerHelpers.validateRequest[J](error) { value =>
            block(request, value)
          }
        }
      }
    }

  def login: Action[JsValue] = action[AuthorizationLoginRequest](AuthorizationLoginRequest.failedValidationMessage) { (_, login) =>
    userProvider.getByEmailAndPassword(login.email, login.password).map {
      case Some(user) if user.verified  => Ok(ServerResponse.EMPTY).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> user.uuid.toString)
      case Some(user) if !user.verified => BadRequest(ServerResponseError(messages("authorization.login.failed.unverified")))
      case None                         => BadRequest(ServerResponseError(messages("authorization.login.failed.email")))
    }
  }

  def signup: Action[JsValue] = action[AuthorizationSignupRequest](AuthorizationSignupRequest.failedValidationMessage) { (_, signup) =>
    userProvider.isUserWithEmailOrLoginExist(signup.email, signup.login).flatMap {
      case (isExistWithEmail, isExistWithLogin) =>
        if (isExistWithEmail) {
          Future.successful(BadRequest(ServerResponseError(messages("authorization.signup.validation.email.exist"))))
        } else if (isExistWithLogin) {
          Future.successful(BadRequest(ServerResponseError(messages("authorization.signup.validation.login.exist"))))
        } else {
          userProvider.create(signup.login, signup.email, signup.password1) map { _ =>
            Ok(ServerResponse.MESSAGE(messages("authorization.signup.success")))
          }
        }
    }
  }

  def reset: Action[JsValue] = action[AuthorizationResetRequest](AuthorizationResetRequest.failedValidationMessage) { (_, reset) =>
    userProvider.getByEmail(reset.email).map { user =>
      user.foreach(u => resetTokenProvider.create(u.uuid))
      Ok(ServerResponse.MESSAGE(messages("authorization.reset.success")))
    }
  }

  def change: Action[JsValue] = action[AuthorizationChangeRequest](AuthorizationChangeRequest.failedValidationMessage) { (_, reset) =>
    userProvider.reset(reset.token, reset.password1) map {
      case true  => Ok(ServerResponse.MESSAGE(messages("authorization.change.success")))
      case false => BadRequest(ServerResponseError("Invalid reset token provided"))
    }
  }

  def verify: Action[JsValue] = action[AuthorizationVerifyRequest]() { (_, verify) =>
    userProvider.verify(verify.token) map {
      case true  => Ok(ServerResponse.MESSAGE(messages("authorization.verify.success")))
      case false => BadRequest(ServerResponseError("Invalid verification token provided"))
    }
  }

  def logout: Action[AnyContent] = Action {
    Ok(ServerResponse.EMPTY).withNewSession
  }

}
