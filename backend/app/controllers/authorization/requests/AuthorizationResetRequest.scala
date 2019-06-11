package controllers.authorization.requests

import java.util.UUID

import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._
import utils.json.JsonValidationUtils._

case class AuthorizationResetRequest(token: UUID, password1: String, password2: String)

object AuthorizationResetRequest {
  final val PASSWORD_MIN_LENGTH = 6
  final val PASSWORD_MAX_LENGTH = 128

  def failedValidationMessage(implicit messages: Messages): String = messages("authorization.reset.validation.failed")

  implicit def authorizationResetRequestReads(implicit messages: Messages): Reads[AuthorizationResetRequest] = {

    val token = (JsPath \ "token").read[UUID]

    val password1 = (JsPath \ "password1").read[String](
      minLength(min = PASSWORD_MIN_LENGTH, error = "authorization.reset.validation.password.minlength") keepAnd
      maxLength(max = PASSWORD_MAX_LENGTH, error = "authorization.reset.validation.password.maxlength")
    )

    val password2 = (JsPath \ "password2").read[String](
      minLength(min = PASSWORD_MIN_LENGTH, error = "authorization.reset.validation.password.minlength") keepAnd
      maxLength(max = PASSWORD_MAX_LENGTH, error = "authorization.reset.validation.password.maxlength")
    )

    val schema = token and password1 and password2

    schema(AuthorizationResetRequest.apply _)
      .filter(JsonValidationError(messages("authorization.reset.validation.passwords.equal")))(r => r.password1 == r.password2)
  }

}
