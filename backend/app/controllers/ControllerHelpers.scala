package controllers

import play.api.Logging
import play.api.i18n.Messages
import play.api.libs.json.{JsError, JsSuccess, JsValue, Reads}
import play.api.mvc.Results._
import play.api.mvc.{Action, BodyParser, Request, Result}
import server.ServerResponseError

import scala.concurrent.{ExecutionContext, Future}

case class WithRecoverAction[A](action: Action[A]) extends Action[A] with Logging {

  override def apply(request: Request[A]): Future[Result] = {
    implicit val ec: ExecutionContext = executionContext
    action(request).recover {
      case e: Exception =>
        logger.error("Internal server error", e)
        InternalServerError(ServerResponseError("InternalServerError"))
    }
  }

  override def parser: BodyParser[A]              = action.parser
  override def executionContext: ExecutionContext = action.executionContext
}

object ControllerHelpers {

  def validateRequest[A](error: String = "Request validation failed")(
      block: A => Future[Result])(implicit request: Request[JsValue], messages: Messages, reads: Reads[A], ec: ExecutionContext): Future[Result] = {
    request.body.validate[A] match {
      case JsError(errors) =>
        Future.successful(BadRequest(ServerResponseError(error, extra = Some(errors.map(e => messages(e._2.head.message)).distinct))))
      case JsSuccess(value, _) =>
        block(value)
    }
  }

}
