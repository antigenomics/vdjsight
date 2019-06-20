package controllers.account

import actions.SessionRequest
import controllers.account.dto.AccountInfoResponse
import controllers.{ControllersTestSpec, ControllersTestTag}
import play.api.libs.json.JsSuccess
import play.api.test.Helpers._
import server.ServerResponse
import traits.DatabaseUsers

import scala.language.reflectiveCalls

class AccountControllerSpec extends ControllersTestSpec with DatabaseUsers {
  "Account#info" should {
    implicit lazy val url: SuiteTestURL = SuiteTestURL("/account/info")

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(POST, PUT, PATCH, DELETE))

    "forbid access if not logged in" taggedAs ControllersTestTag in {
      val request = FakeEmptyRequest(method = GET)
      Route(request) { result =>
        status(result) shouldEqual UNAUTHORIZED
      }
    }

    "be able to return account info for verified user" taggedAs ControllersTestTag in {
      val request = FakeEmptyRequest(method = GET).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> users.verifiedUser.uuid.toString)
      Route(request) { result =>
        status(result) shouldEqual OK
        contentAsJson(result).validate[ServerResponse[AccountInfoResponse]].map { response =>
          response.data.user.email shouldEqual users.verifiedUser.credentials.email
          response.data.user.login shouldEqual users.verifiedUser.credentials.login
        } shouldBe a[JsSuccess[_]]
      }
    }
  }
}
