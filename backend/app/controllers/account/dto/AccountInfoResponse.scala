package controllers.account.dto

import models.user.UserDTO
import play.api.libs.json.{Format, Json}

case class AccountInfoResponse(user: UserDTO)

object AccountInfoResponse {
  implicit final val accountInfoResponseFormat: Format[AccountInfoResponse] = Json.format[AccountInfoResponse]
}
