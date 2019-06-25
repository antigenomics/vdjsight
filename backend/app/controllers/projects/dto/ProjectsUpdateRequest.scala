package controllers.projects.dto

import java.util.UUID

import models.project.ProjectLinkDTO
import play.api.libs.json.{Json, Reads, Writes}

case class ProjectsUpdateRequest(uuid: UUID, name: String, description: String)

object ProjectsUpdateRequest {
  implicit val projectsUpdateRequestReads: Reads[ProjectsUpdateRequest] = Json.reads[ProjectsUpdateRequest]
}

case class ProjectsUpdateResponse(link: ProjectLinkDTO)

object ProjectsUpdateResponse {
  implicit val projectsUpdateResponseWrites: Writes[ProjectsUpdateResponse] = Json.writes[ProjectsUpdateResponse]
}
