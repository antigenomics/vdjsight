package controllers.account

import actions.SessionRequestAction
import com.google.inject.{Inject, Singleton}
import controllers.account.dto.AccountInfoResponse
import models.user.{UserDTO, UserProvider}
import org.slf4j.{Logger, LoggerFactory}
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import server.{ServerResponse, ServerResponseError}

import scala.concurrent.ExecutionContext

@Singleton
class AccountController @Inject()(cc: ControllerComponents, session: SessionRequestAction)(
  implicit
  ec: ExecutionContext,
  userProvider: UserProvider
) extends AbstractController(cc) {

  implicit final private val logger: Logger = LoggerFactory.getLogger(this.getClass)

  private def accountAction = session andThen session.authorizedOnly

  def info: Action[Unit] = accountAction(parse.empty).async { implicit request =>
    userProvider.get(request.userID.get).map {
      case Some(user) => Ok(ServerResponse(AccountInfoResponse(UserDTO(user))))
      case None       => BadRequest(ServerResponseError("Invalid UUID")).withNewSession
    }
  }

}
