package controllers.authorization.dto

import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Reads}
import utils.json.JsonValidationUtils._

case class AuthorizationResetRequest(email: String)

object AuthorizationResetRequest {
  final val EMAIL_MAX_LENGTH = 255

  def failedValidationMessage(implicit messages: Messages): String = messages("authorization.reset.validation.failed")

  implicit def authorizationResetRequestReads(implicit messages: Messages): Reads[AuthorizationResetRequest] = {
    (JsPath \ "email")
      .read[String](
        validEmail(error = "authorization.reset.validation.email.valid") keepAnd
          minLength(min = 1, error = "authorization.reset.validation.email.minlength") keepAnd
          maxLength(max = EMAIL_MAX_LENGTH, error = "authorization.reset.validation.email.maxlength")
      )
      .map(AuthorizationResetRequest.apply)
  }
}
