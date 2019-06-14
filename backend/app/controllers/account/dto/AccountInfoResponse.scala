package controllers.account.dto

import play.api.libs.json.{Json, Format}

case class AccountInfoResponse(login: String, email: String)

object AccountInfoResponse {
    implicit final val accountInfoResponseFormat: Format[AccountInfoResponse] = Json.format[AccountInfoResponse]
}
