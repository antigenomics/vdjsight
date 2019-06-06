package controllers.authorization

import java.util.UUID

import actions.{SessionRequest, SessionRequestAction}
import javax.inject.Inject
import models.user.UserProvider
import play.api.i18n._
import play.api.libs.json.{JsError, JsSuccess, JsValue}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import server.ServerResponseError

import scala.concurrent.{ExecutionContext, Future}


class AuthorizationController @Inject()(cc: ControllerComponents, session: SessionRequestAction, messagesAPI: MessagesApi, up: UserProvider)
                                       (implicit ec: ExecutionContext) extends AbstractController(cc) {
  implicit val messages: Messages = messagesAPI.preferred(Seq(Lang.defaultLang))

  def onLogin: Action[AnyContent] = (session andThen SessionRequestAction.unauthorizedOnly) { implicit request =>
    Ok(request.request.session.data.toString).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> UUID.randomUUID().toString)
  }

  def onSignup: Action[JsValue] = (session andThen SessionRequestAction.unauthorizedOnly) (parse.json).async { implicit request =>
    request.body.validate[AuthorizationSignupRequest] match {
      case JsError(errors) => Future.successful {
        BadRequest(ServerResponseError(messages("authorization.signup.validation.failed"),
          extra = Some(errors.map(_._2.head.message).distinct))
        )
      }
      case JsSuccess(signup, _) =>
        up.isVerifiedUserWithEmailExist(signup.email).map { exist =>
          if (!exist) {
            Ok("")
          } else {
            BadRequest(ServerResponseError(messages("authorization.signup.validation.email.exist")))
          }
        }
    }
  }

  def onLogout: Action[AnyContent] = Action {
    Ok(ServerResponseError("asd")).withNewSession
  }

}
