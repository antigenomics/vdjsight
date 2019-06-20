package controllers.projects.overview.dto

import models.project.ProjectLinkDTO
import play.api.libs.json.{Json, Writes}

case class ProjectsOverviewListResponse(projects: Seq[ProjectLinkDTO])

object ProjectsOverviewListResponse {
  implicit final val projectsOverviewListResponseWrites: Writes[ProjectsOverviewListResponse] = Json.writes[ProjectsOverviewListResponse]
}
