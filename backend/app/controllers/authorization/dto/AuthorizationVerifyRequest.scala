package controllers.authorization.dto

import java.util.UUID

import play.api.i18n.Messages
import play.api.libs.json.{JsPath, Reads}

case class AuthorizationVerifyRequest(token: UUID)

object AuthorizationVerifyRequest {

  implicit def authorizationVerifyRequestReads(implicit messages: Messages): Reads[AuthorizationVerifyRequest] = {
    (JsPath \ "token").read[UUID].map(AuthorizationVerifyRequest.apply)
  }

}
