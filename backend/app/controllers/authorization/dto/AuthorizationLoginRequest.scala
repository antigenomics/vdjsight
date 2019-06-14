package controllers.authorization.dto

import play.api.i18n.Messages
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Reads}
import utils.json.JsonValidationUtils._

case class AuthorizationLoginRequest(email: String, password: String)

object AuthorizationLoginRequest {

  def failedValidationMessage(implicit messages: Messages): String = messages("authorization.login.validation.failed")

  implicit def authorizationLoginRequestReads(implicit messages: Messages): Reads[AuthorizationLoginRequest] = {

    val email = (JsPath \ "email").read[String](
      validEmail(error = "authorization.login.validation.email.valid") keepAnd
        minLength(min = 1, error = "authorization.login.validation.email.minlength")
    )

    val password = (JsPath \ "password").read[String](
      minLength(min = 1, error = "authorization.login.validation.password.minlength")
    )

    val schema = email and password

    schema(AuthorizationLoginRequest.apply _)
  }

}
