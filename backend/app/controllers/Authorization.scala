package controllers

import java.util.UUID

import actions.{SessionRequest, SessionRequestAction}
import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext

class Authorization @Inject()(cc: ControllerComponents, session: SessionRequestAction)(implicit ec: ExecutionContext)
  extends AbstractController(cc) {

  def onLogin: Action[AnyContent] = (session andThen SessionRequestAction.unauthorizedOnly) { implicit request =>
    Ok(request.request.session.data.toString).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> UUID.randomUUID().toString)
  }

  def onLogout: Action[AnyContent] = Action { Ok("").withNewSession }

}
