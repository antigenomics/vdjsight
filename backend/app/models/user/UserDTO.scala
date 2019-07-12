package models.user

import play.api.libs.json.{Format, Json}

import scala.concurrent.ExecutionContext

case class UserPermissionsDTO(
  maxProjectsCount: Long,
  maxSamplesCount: Long,
  maxSampleSize: Long
)

case class UserDTO(
  login: String,
  email: String,
  permissions: UserPermissionsDTO
)

object UserDTO {
  implicit val userPermissionsDTOFormat: Format[UserPermissionsDTO] = Json.format[UserPermissionsDTO]
  implicit val userDTOFormat: Format[UserDTO]                       = Json.format[UserDTO]

  def from(user: User, permissions: UserPermissions)(implicit ec: ExecutionContext): UserDTO = {
    UserDTO(
      user.login,
      user.email,
      UserPermissionsDTO(
        permissions.maxProjectsCount,
        permissions.maxSamplesCount,
        permissions.maxSampleSize
      )
    )
  }
}
