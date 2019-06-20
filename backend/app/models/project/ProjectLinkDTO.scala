package models.project

import java.util.UUID

import play.api.libs.json.{Format, Json}

case class ProjectLinkDTO(
  uuid: UUID,
  name: String,
  isShared: Boolean,
  isUploadAllowed: Boolean,
  isDeleteAllowed: Boolean,
  isModificationAllowed: Boolean
)

// TODO Add permissions

object ProjectLinkDTO {
  implicit val projectDTOFormat: Format[ProjectLinkDTO] = Json.format[ProjectLinkDTO]

  def apply(link: ProjectLink, project: Project): ProjectLinkDTO = {
    ProjectLinkDTO(
      uuid                  = link.uuid,
      name                  = project.name,
      isShared              = link.isShared,
      isUploadAllowed       = link.isUploadAllowed,
      isDeleteAllowed       = link.isDeleteAllowed,
      isModificationAllowed = link.isModificationAllowed
    )
  }

  def apply(union: (ProjectLink, Project)): ProjectLinkDTO = {
    ProjectLinkDTO(union._1, union._2)
  }

}
