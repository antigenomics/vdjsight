package controllers.account

import actions.SessionRequestAction
import com.google.inject.{Inject, Singleton}
import controllers.account.dto.AccountInfoResponse
import models.user.UserProvider
import org.slf4j.{Logger, LoggerFactory}
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.ExecutionContext

@Singleton
class AccountController @Inject()(cc: ControllerComponents, sessionAction: SessionRequestAction, up: UserProvider)(implicit ec: ExecutionContext)
    extends AbstractController(cc) {

    private implicit final val logger: Logger = LoggerFactory.getLogger(this.getClass)

    private def accountSecuredAction = sessionAction andThen sessionAction.authorizedOnly

    def info: Action[Unit] = accountSecuredAction(parse.empty).async { implicit request =>

        up.get(request.userID.get).map {
            case Some(user) => Ok(ServerResponse(AccountInfoResponse(user.login, user.email)))
            case None => BadRequest(ServerResponseError("Invalid UUID")).withNewSession
        }
    }

}
