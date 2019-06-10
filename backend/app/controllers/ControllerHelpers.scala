package controllers

import play.api.i18n.Messages
import play.api.libs.json.{JsError, JsSuccess, JsValue, Reads}
import play.api.mvc.Results._
import play.api.mvc.{Request, Result}
import server.ServerResponseError

import scala.concurrent.Future

object ControllerHelpers {

  def validateRequest[A](error: String = "request.validation.failed")(block: A => Future[Result])
                        (implicit request: Request[JsValue], messages: Messages, reads: Reads[A]): Future[Result] = {
    request.body.validate[A] match {
      case JsError(errors)     => Future.successful(BadRequest(ServerResponseError(messages(error), extra = Some(errors.map(_._2.head.message).distinct))))
      case JsSuccess(value, _) => block(value)

    }
  }

}
