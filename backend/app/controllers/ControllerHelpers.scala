package controllers

import org.slf4j.Logger
import play.api.i18n.Messages
import play.api.libs.json.{JsError, JsSuccess, JsValue, Reads}
import play.api.mvc.Results._
import play.api.mvc.{Request, Result}
import server.ServerResponseError

import scala.concurrent.{ExecutionContext, Future}

object ControllerHelpers {

  def validateRequestWithRecover[A](error: String = "Request validation failed")(block: A => Future[Result])(implicit request: Request[JsValue],
                                                                                                             messages: Messages,
                                                                                                             reads: Reads[A],
                                                                                                             ec: ExecutionContext,
                                                                                                             logger: Logger): Future[Result] = {
    request.body.validate[A] match {
      case JsError(errors) =>
        Future.successful(BadRequest(ServerResponseError(error, extra = Some(errors.map(e => messages(e._2.head.message)).distinct))))
      case JsSuccess(value, _) =>
        block(value) recover {
          case e: Exception =>
            logger.error("Internal server error", e)
            InternalServerError(ServerResponseError("InternalServerError"))
        }

    }
  }

}
