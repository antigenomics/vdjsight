package controllers.projects

import java.sql.Timestamp
import java.util.{Date, UUID}

import actions.SessionRequest
import controllers.projects.dto.{ProjectsCreateRequest, ProjectsCreateResponse, ProjectsListResponse}
import controllers.{ControllersTestSpec, ControllersTestTag}
import models.project.ProjectLinkDTO
import play.api.libs.json.{Json, Reads, Writes}
import play.api.test.Helpers._
import traits.{DatabaseProjectLinks, DatabaseProviders}

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.language.reflectiveCalls

class ProjectsControllerSpec extends ControllersTestSpec with DatabaseProviders with DatabaseProjectLinks {
  implicit val timestampReader: Reads[Timestamp]          = Reads.of[Date].map(d => new Timestamp(d.getTime))
  implicit val projectLinkDTOReads: Reads[ProjectLinkDTO] = Json.reads[ProjectLinkDTO]

  "Projects#list" should {
    implicit lazy val url: SuiteTestURL               = SuiteTestURL("/projects/list")
    implicit lazy val rr: Reads[ProjectsListResponse] = Json.reads[ProjectsListResponse]

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(POST, PUT, PATCH, DELETE))

    "forbid access if not logged in" taggedAs ControllersTestTag in {
      val request = FakeEmptyRequest(method = GET)
      Route(request) { result =>
        status(result) shouldEqual UNAUTHORIZED
      }
    }

    "return empty list for not existing user in" taggedAs ControllersTestTag in {
      val request = FakeEmptyRequest(method = GET).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> UUID.randomUUID().toString)
      Route(request) { result =>
        val response = contentAsServerResponse[ProjectsListResponse](result)
        response.projects.length shouldEqual 0
        status(result) shouldEqual OK
      }
    }

    "return list of project links for existing user in" taggedAs ControllersTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      val request = FakeEmptyRequest(method = GET).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> user.uuid.toString)
      Route(request) { result =>
        val response = contentAsServerResponse[ProjectsListResponse](result)
        response.projects.map(dto => dto.uuid) should contain(link.uuid)
        status(result) shouldEqual OK
      }
    }
  }

  "Projects#create" should {
    implicit lazy val url: SuiteTestURL                 = SuiteTestURL("/projects/list/create")
    implicit lazy val rw: Writes[ProjectsCreateRequest] = Json.writes[ProjectsCreateRequest]
    implicit lazy val rr: Reads[ProjectsCreateResponse] = Json.reads[ProjectsCreateResponse]

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(GET, PUT, PATCH, DELETE))

    "forbid access on malformed json input" taggedAs ControllersTestTag in CheckMalformedJSONInput(method = POST)

    "forbid access if not logged in" taggedAs ControllersTestTag in {
      val request = FakeJsonRequest(Json.toJson(ProjectsCreateRequest("name", "description")).toString(), method = POST)
      Route(request) { result =>
        status(result) shouldEqual UNAUTHORIZED
      }
    }

    "return an error for not existing user in" taggedAs ControllersTestTag in {
      val request = FakeJsonRequest(
        Json.toJson(ProjectsCreateRequest("name", "description")).toString(),
        method = POST
      ).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> UUID.randomUUID().toString)
      Route(request) { result =>
        contentAsString(result) should include("User does not exist")
        status(result) shouldEqual BAD_REQUEST
      }
    }

    "create a new project for existing user in" taggedAs ControllersTestTag in {
      val user = users.verifiedUser
      val request = FakeJsonRequest(
        Json.toJson(ProjectsCreateRequest("name", "description")).toString(),
        method = POST
      ).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> user.uuid.toString)
      Route(request) { result =>
        val response = contentAsServerResponse[ProjectsCreateResponse](result)
        response.link.name shouldEqual "name"
        response.link.description shouldEqual "description"

        val linkInDB = Await.result(plp.get(response.link.uuid), Duration.Inf)

        linkInDB should not be empty
        linkInDB.get.uuid shouldEqual response.link.uuid

        val projectInDB = Await.result(pp.get(linkInDB.get.projectID), Duration.Inf)

        projectInDB should not be empty
        projectInDB.get.name shouldEqual "name"
        projectInDB.get.description shouldEqual "description"

        status(result) shouldEqual OK
      }
    }

  }

}
