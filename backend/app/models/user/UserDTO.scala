package models.user

import play.api.libs.json.{Format, Json}

import scala.concurrent.ExecutionContext

case class UserDTO(
  login: String,
  email: String
)

object UserDTO {
  implicit val userDTOFormat: Format[UserDTO] = Json.format[UserDTO]

  def apply(user: User)(implicit ec: ExecutionContext): UserDTO = {
    UserDTO(user.login, user.email)
  }
}
