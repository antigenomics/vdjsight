package controllers.projects.dto

import java.util.UUID

import play.api.libs.json.{Json, Reads}

case class ProjectsDeleteRequest(id: UUID, force: Boolean)

object ProjectsDeleteRequest {
  implicit val projectsDeleteRequestReads: Reads[ProjectsDeleteRequest] = Json.reads[ProjectsDeleteRequest]
}
