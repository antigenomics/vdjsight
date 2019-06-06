package controllers.authorization

import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import play.api.libs.json._

case class AuthorizationSignupRequest(login: String, email: String, password1: String, password2: String)

object AuthorizationSignupRequest {
  final val LOGIN_MAX_LENGTH    = 64
  final val EMAIL_MAX_LENGTH    = 255
  final val PASSWORD_MIN_LENGTH = 6
  final val PASSWORD_MAX_LENGTH = 128

  implicit def authorizationSignupRequestReads(implicit messages: Messages): Reads[AuthorizationSignupRequest] = {

    val login = (JsPath \ "login")
      .read[String]
      .filter(JsonValidationError(messages("authorization.signup.validation.login.minlength")))(_.length > 0)
      .filter(JsonValidationError(messages("authorization.signup.validation.login.maxlength", LOGIN_MAX_LENGTH)))(_.length < LOGIN_MAX_LENGTH)

    val email = (JsPath \ "email")
      .read[String](
        pattern(
          """^[a-zA-Z0-9\.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$""".r,
          error = messages("authorization.signup.validation.email.valid")
        )
      )
      .filter(JsonValidationError(messages("authorization.signup.validation.email.minlength")))(_.length > 0)
      .filter(JsonValidationError(messages("authorization.signup.validation.email.maxlength", EMAIL_MAX_LENGTH)))(_.length < EMAIL_MAX_LENGTH)

    val password1 = (JsPath \ "password1")
      .read[String]
      .filter(JsonValidationError(messages("authorization.signup.validation.password.minlength", PASSWORD_MIN_LENGTH)))(_.length > PASSWORD_MIN_LENGTH)
      .filter(JsonValidationError(messages("authorization.signup.validation.password.maxlength", PASSWORD_MAX_LENGTH)))(_.length < PASSWORD_MAX_LENGTH)

    val password2 = (JsPath \ "password2")
      .read[String]
      .filter(JsonValidationError(messages("authorization.signup.validation.password.minlength", PASSWORD_MIN_LENGTH)))(_.length > PASSWORD_MIN_LENGTH)
      .filter(JsonValidationError(messages("authorization.signup.validation.password.maxlength", PASSWORD_MAX_LENGTH)))(_.length < PASSWORD_MAX_LENGTH)

    val schema = login and email and password1 and password2

    schema(AuthorizationSignupRequest.apply _)
      .filter(JsonValidationError(messages("authorization.signup.validation.passwords.equal")))(r => r.password1 == r.password2)

  }
}
