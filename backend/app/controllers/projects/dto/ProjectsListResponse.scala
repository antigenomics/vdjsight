package controllers.projects.dto

import models.project.ProjectLinkDTO
import play.api.libs.json.{Json, Writes}

case class ProjectsListResponse(projects: Seq[ProjectLinkDTO])

object ProjectsListResponse {
  implicit final val projectsListResponseWrites: Writes[ProjectsListResponse] = Json.writes[ProjectsListResponse]
}
