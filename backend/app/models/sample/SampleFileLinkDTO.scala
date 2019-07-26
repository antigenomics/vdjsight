package models.sample

import java.sql.{Date, Timestamp}
import java.util.UUID

import models.project.ProjectLink
import play.api.libs.json.{Json, Writes}

case class SampleFileLinkDTO(
  uuid: UUID,
  name: String,
  software: String,
  size: Long,
  extension: String,
  hash: String,
  uploaded: Boolean,
  projectLinkUUID: UUID,
  deleteOn: Option[Timestamp]
)

object SampleFileLinkDTO {
  implicit val timestampWriter: Writes[Option[Timestamp]]     = (o: Option[Timestamp]) => Json.toJson(o.map(t => new Date(t.getTime)))
  implicit val sampleFileDTOFormat: Writes[SampleFileLinkDTO] = Json.writes[SampleFileLinkDTO]

  def from(link: SampleFileLink, sample: SampleFile, projectLink: ProjectLink): SampleFileLinkDTO = {
    SampleFileLinkDTO(
      uuid            = link.uuid,
      name            = sample.name,
      software        = sample.software,
      size            = sample.size,
      extension       = sample.extension,
      hash            = sample.hash,
      uploaded        = sample.isUploaded,
      projectLinkUUID = projectLink.uuid,
      deleteOn        = link.deleteOn
    )
  }

  def from(union: (SampleFileLink, SampleFile), projectLink: ProjectLink): SampleFileLinkDTO = {
    SampleFileLinkDTO.from(union._1, union._2, projectLink)
  }
}
