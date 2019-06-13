package controllers.authorization.requests

import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Reads}
import utils.json.JsonValidationUtils._

case class AuthorizationBeforeResetRequest(email: String)

object AuthorizationBeforeResetRequest {
  final val EMAIL_MAX_LENGTH = 255

  def failedValidationMessage(implicit messages: Messages): String = messages("authorization.before-reset.validation.failed")

  implicit def authorizationBeforeResetRequestReads(implicit messages: Messages): Reads[AuthorizationBeforeResetRequest] = {
    (JsPath \ "email")
      .read[String](
        validEmail(error = "authorization.before-reset.validation.email.valid") keepAnd
          minLength(min = 1, error = "authorization.before-reset.validation.email.minlength") keepAnd
          maxLength(max = EMAIL_MAX_LENGTH, error = "authorization.before-reset.validation.email.maxlength")
      )
      .map(AuthorizationBeforeResetRequest.apply)
  }
}
