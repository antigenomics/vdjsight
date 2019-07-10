package models.project

import java.sql.Timestamp
import java.util.{Date, UUID}

import play.api.libs.json.{Json, Writes}

case class ProjectLinkDTO(
  uuid: UUID,
  name: String,
  description: String,
  isShared: Boolean,
  isUploadAllowed: Boolean,
  isDeleteAllowed: Boolean,
  isModificationAllowed: Boolean,
  deleteOn: Option[Timestamp]
)

object ProjectLinkDTO {
  implicit val timestampWriter: Writes[Option[Timestamp]] = (o: Option[Timestamp]) => Json.toJson(o.map(t => new Date(t.getTime)))
  implicit val projectDTOFormat: Writes[ProjectLinkDTO]   = Json.writes[ProjectLinkDTO]

  def from(link: ProjectLink, project: Project): ProjectLinkDTO = {
    ProjectLinkDTO(
      uuid                  = link.uuid,
      name                  = project.name,
      description           = project.description,
      isShared              = link.isShared,
      isUploadAllowed       = link.isUploadAllowed,
      isDeleteAllowed       = link.isDeleteAllowed,
      isModificationAllowed = link.isModificationAllowed,
      deleteOn              = link.deleteOn
    )
  }

  def from(union: (ProjectLink, Project)): ProjectLinkDTO = {
    ProjectLinkDTO.from(union._1, union._2)
  }

}
