package controllers.projects.overview.dto

import models.project.ProjectLinkDTO
import play.api.libs.json.{Json, Reads, Writes}

case class ProjectsOverviewCreateRequest(name: String, description: String)

object ProjectsOverviewCreateRequest {
  implicit final val projectsOverviewCreateRequestReads: Reads[ProjectsOverviewCreateRequest] = Json.reads[ProjectsOverviewCreateRequest]
}

case class ProjectsOverviewCreateResponse(link: ProjectLinkDTO)

object ProjectsOverviewCreateResponse {
  implicit final val projectsOverviewCreateResponseWrites: Writes[ProjectsOverviewCreateResponse] = Json.writes[ProjectsOverviewCreateResponse]
}
