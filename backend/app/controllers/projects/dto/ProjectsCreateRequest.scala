package controllers.projects.dto

import models.project.ProjectLinkDTO
import play.api.libs.json.{Json, Reads, Writes}

case class ProjectsCreateRequest(name: String, description: String)

object ProjectsCreateRequest {
  implicit final val projectsOverviewCreateRequestReads: Reads[ProjectsCreateRequest] = Json.reads[ProjectsCreateRequest]
}

case class ProjectsCreateResponse(link: ProjectLinkDTO)

object ProjectsCreateResponse {
  implicit final val projectsOverviewCreateResponseWrites: Writes[ProjectsCreateResponse] = Json.writes[ProjectsCreateResponse]
}
