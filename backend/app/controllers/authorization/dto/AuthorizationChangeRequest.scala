package controllers.authorization.dto

import java.util.UUID

import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._
import utils.json.JsonValidationUtils._

case class AuthorizationChangeRequest(token: UUID, password1: String, password2: String)

object AuthorizationChangeRequest {
  final val PASSWORD_MIN_LENGTH = 6
  final val PASSWORD_MAX_LENGTH = 128

  def failedValidationMessage(implicit messages: Messages): String = messages("authorization.change.validation.failed")

  implicit def authorizationChangeRequestReads(implicit messages: Messages): Reads[AuthorizationChangeRequest] = {

    val token = (JsPath \ "token").read[UUID]

    val password1 = (JsPath \ "password1").read[String](
      minLength(min = PASSWORD_MIN_LENGTH, error = "authorization.change.validation.password.minlength") keepAnd
      maxLength(max = PASSWORD_MAX_LENGTH, error = "authorization.change.validation.password.maxlength")
    )

    val password2 = (JsPath \ "password2").read[String](
      minLength(min = PASSWORD_MIN_LENGTH, error = "authorization.change.validation.password.minlength") keepAnd
      maxLength(max = PASSWORD_MAX_LENGTH, error = "authorization.change.validation.password.maxlength")
    )

    val schema = token and password1 and password2

    schema(AuthorizationChangeRequest.apply _)
      .filter(JsonValidationError(messages("authorization.change.validation.passwords.equal")))(r => r.password1 == r.password2)
  }

}
