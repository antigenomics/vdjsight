package controllers.authorization.requests

import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json._
import utils.json.JsonValidationUtils._

case class AuthorizationSignupRequest(login: String, email: String, password1: String, password2: String)

object AuthorizationSignupRequest {
  final val LOGIN_MAX_LENGTH    = 64
  final val EMAIL_MAX_LENGTH    = 255
  final val PASSWORD_MIN_LENGTH = 6
  final val PASSWORD_MAX_LENGTH = 128

  def failedValidationMessage(implicit messages: Messages): String = messages("authorization.signup.validation.failed")

  implicit def authorizationSignupRequestReads(implicit messages: Messages): Reads[AuthorizationSignupRequest] = {

    val login = (JsPath \ "login").read[String](
      minLength(min = 0, error = "authorization.signup.validation.login.minlength") keepAnd
        maxLength(max = LOGIN_MAX_LENGTH, error = "authorization.signup.validation.login.maxlength")
    )

    val email = (JsPath \ "email").read[String](
      validEmail(error = "authorization.signup.validation.email.valid") keepAnd
        minLength(min = 0, error = "authorization.signup.validation.email.minlength") keepAnd
        maxLength(max = EMAIL_MAX_LENGTH, error = "authorization.signup.validation.email.maxlength")
    )

    val password1 = (JsPath \ "password1").read[String](
      minLength(min = PASSWORD_MIN_LENGTH, error = "authorization.signup.validation.password.minlength") keepAnd
        maxLength(max = PASSWORD_MAX_LENGTH, error = "authorization.signup.validation.password.maxlength")
    )

    val password2 = (JsPath \ "password2").read[String](
      minLength(min = PASSWORD_MIN_LENGTH, error = "authorization.signup.validation.password.minlength") keepAnd
        maxLength(max = PASSWORD_MAX_LENGTH, error = "authorization.signup.validation.password.maxlength")
    )

    val schema = login and email and password1 and password2

    schema(AuthorizationSignupRequest.apply _)
      .filter(JsonValidationError(messages("authorization.signup.validation.passwords.equal")))(r => r.password1 == r.password2)

  }
}
