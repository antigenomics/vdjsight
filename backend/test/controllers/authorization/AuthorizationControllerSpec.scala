package controllers.authorization

import java.util.UUID

import actions.SessionRequest
import controllers.{ControllersTestSpec, ControllersTestTag}
import play.api.test.Helpers._
import traits.{DatabaseProviders, DatabaseUsers}

import scala.language.reflectiveCalls

class AuthorizationControllerSpec extends ControllersTestSpec with DatabaseProviders with DatabaseUsers {

  "Authorization#login" should {
    implicit lazy val url: SuiteTestURL = SuiteTestURL("/auth/login")

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(GET, PUT, PATCH, DELETE))

    "forbid access on malformed json input" taggedAs ControllersTestTag in CheckMalformedJSONInput(method = POST)

    "forbid access if logged in" taggedAs ControllersTestTag in {
      val request = FakeJsonRequest(body = "{}", method = POST).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> users.verifiedUser.uuid.toString)
      Route(request) { result =>
        status(result) shouldEqual FORBIDDEN
      }
    }

    "be able to verify input request" taggedAs ControllersTestTag in VerifyInputRequest(method = POST, expectedStatus = BAD_REQUEST) {
      Seq(
        "Missing input"    -> Map(),
        "Missing email"    -> Map("password" -> users.notExistingUser.credentials.password),
        "Missing password" -> Map("email" -> users.notExistingUser.credentials.email),
        "Empty input"      -> Map("email" -> "", "password" -> ""),
        "Empty email"      -> Map("email" -> "", "password" -> users.notExistingUser.credentials.password),
        "Empty password"   -> Map("email" -> users.notExistingUser.credentials.email, "password" -> ""),
        "Invalid email"    -> Map("email" -> "invalid", "password" -> "invalid")
      )
    }

    "forbid to login with invalid credentials" taggedAs ControllersTestTag in VerifyInputRequest(method = POST, expectedStatus = BAD_REQUEST) {
      Seq(
        "Not verified user" -> Map("email" -> users.notVerifiedUser.credentials.email, "password" -> users.notVerifiedUser.credentials.password),
        "Wrong password"    -> Map("email" -> users.verifiedUser.credentials.email, "password"    -> (users.verifiedUser.credentials.password + "_")),
        "Wrong email"       -> Map("email" -> users.notExistingUser.credentials.email, "password" -> users.notExistingUser.credentials.password)
      )
    }

    "be able to create session for verified user" taggedAs ControllersTestTag in {
      val request = FakeJsonRequest(
        Map("email" -> users.verifiedUser.credentials.email, "password" -> users.verifiedUser.credentials.password)
      )

      Route(request) { result =>
        status(result) shouldEqual OK
        session(result).data should contain key SessionRequest.SESSION_REQUEST_USER_ID_KEY
      }
    }
  }

  "Authorization#signup" should {
    implicit lazy val url: SuiteTestURL = SuiteTestURL("/auth/signup")

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(GET, PUT, PATCH, DELETE))

    "forbid access on malformed json input" taggedAs ControllersTestTag in CheckMalformedJSONInput(method = POST)

    "forbid access if logged in" taggedAs ControllersTestTag in {
      val request = FakeJsonRequest(body = "{}", method = POST).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> users.verifiedUser.uuid.toString)
      Route(request) { result =>
        status(result) shouldEqual FORBIDDEN
      }
    }

    "be able to verify input request" taggedAs ControllersTestTag in VerifyInputRequest(method = POST, expectedStatus = BAD_REQUEST) {
      val neuc = users.notExistingUser.credentials
      Seq(
        "Missing input"       -> Map(),
        "Missing email"       -> Map("login" -> neuc.login, "password1" -> neuc.password, "password2" -> neuc.password),
        "Missing login"       -> Map("email" -> neuc.email, "password1" -> neuc.password, "password2" -> neuc.password),
        "Missing password1"   -> Map("login" -> neuc.login, "email" -> neuc.email, "password2" -> neuc.password),
        "Missing password2"   -> Map("login" -> neuc.login, "email" -> neuc.email, "password1" -> neuc.password),
        "Empty input"         -> Map("email" -> "", "password" -> "", "password1" -> "", "password2" -> ""),
        "Empty email"         -> Map("login" -> neuc.login, "email" -> "", "password1" -> neuc.password, "password2" -> neuc.password),
        "Empty login"         -> Map("login" -> "", "email" -> neuc.email, "password1" -> neuc.password, "password2" -> neuc.password),
        "Empty password1"     -> Map("login" -> neuc.login, "email" -> neuc.email, "password1" -> "", "password2" -> neuc.password),
        "Empty password2"     -> Map("login" -> neuc.login, "email" -> neuc.email, "password1" -> neuc.password, "password2" -> ""),
        "Invalid email"       -> Map("email" -> "invalid", "login" -> neuc.login, "password1" -> neuc.password, "password2" -> neuc.password),
        "Different passwords" -> Map("email" -> neuc.email, "login" -> neuc.login, "password1" -> (neuc.password + "_"), "password2" -> neuc.password),
      )
    }

    "be able to signup new user" taggedAs ControllersTestTag in {
      val neuc    = users.notExistingUser.credentials
      val request = FakeJsonRequest(Map("login" -> neuc.login, "email" -> neuc.email, "password1" -> neuc.password, "password2" -> neuc.password))
      Route(request) { result =>
        for {
          _       <- status(result) shouldEqual OK
          byEmail <- up.getByEmail(neuc.email)
          byLogin <- up.getByLogin(neuc.login)
          _       <- byEmail should not be empty
          _       <- byLogin should not be empty
          _       <- byEmail.get.uuid shouldEqual byLogin.get.uuid
          delete  <- up.delete(byEmail.get.uuid)
        } yield delete shouldEqual 1
      }
    }
  }

  "Authorization#reset-request" should {
    implicit lazy val url: SuiteTestURL = SuiteTestURL("/auth/reset-request")

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(GET, PUT, PATCH, DELETE))

    "forbid access on malformed json input" taggedAs ControllersTestTag in CheckMalformedJSONInput(method = POST)

    "forbid access if logged in" taggedAs ControllersTestTag in {
      val request = FakeJsonRequest(body = "{}", method = POST).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> users.verifiedUser.uuid.toString)
      Route(request) { result =>
        status(result) shouldEqual FORBIDDEN
      }
    }

    "be able to verify input request" taggedAs ControllersTestTag in VerifyInputRequest(method = POST, expectedStatus = BAD_REQUEST) {
      Seq(
        "Missing email" -> Map(),
        "Empty email"   -> Map("email" -> ""),
        "Invalid email" -> Map("email" -> "invalid"),
      )
    }

    "be able to handle valid before reset request" taggedAs ControllersTestTag in VerifyInputRequest(method = POST, expectedStatus = OK) {
      Seq(
        "Verified user"     -> Map("email" -> users.verifiedUser.credentials.email),
        "Not verified user" -> Map("email" -> users.notVerifiedUser.credentials.email),
        "Not existing user" -> Map("email" -> users.notExistingUser.credentials.email)
      )
    }
  }

  "Authorization#reset" should {
    implicit lazy val url: SuiteTestURL = SuiteTestURL("/auth/reset")

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(GET, PUT, PATCH, DELETE))

    "forbid access on malformed json input" taggedAs ControllersTestTag in CheckMalformedJSONInput(method = POST)

    "forbid access if logged in" taggedAs ControllersTestTag in {
      val request = FakeJsonRequest(body = "{}", method = POST).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> users.verifiedUser.uuid.toString)
      Route(request) { result =>
        status(result) shouldEqual FORBIDDEN
      }
    }

    "be able to verify input request" taggedAs ControllersTestTag in VerifyInputRequest(method = POST, expectedStatus = BAD_REQUEST) {
      Seq(
        "Missing input"       -> Map(),
        "Missing token"       -> Map("password1" -> "1234567890", "password2" -> "1234567890"),
        "Missing password1"   -> Map("token" -> UUID.randomUUID().toString, "password2" -> "1234567890"),
        "Missing password2"   -> Map("token" -> UUID.randomUUID().toString, "password1" -> "1234567890"),
        "Empty token"         -> Map("token" -> "", "password1" -> "1234567890", "password2" -> "1234567890"),
        "Empty password1"     -> Map("token" -> UUID.randomUUID().toString, "password1" -> "", "password2" -> "1234567890"),
        "Empty password2"     -> Map("token" -> UUID.randomUUID().toString, "password1" -> "1234567890", "password2" -> ""),
        "Invalid token"       -> Map("token" -> "1234", "password1" -> "1234567890", "password2" -> "1234567890"),
        "Different passwords" -> Map("token" -> UUID.randomUUID().toString, "password1" -> "1234567890", "password2" -> "0987654321"),
      )
    }

    "be able to handle valid reset request" taggedAs ControllersTestTag in {
      up.get(users.verifiedUser.uuid).flatMap { verifiedUserInDBBeforeReset =>
        verifiedUserInDBBeforeReset should not be empty
        rtp.create(users.verifiedUser.uuid).flatMap { token =>
          val request = FakeJsonRequest(Map("token" -> token.toString, "password1" -> "new-password-1234", "password2" -> "new-password-1234"))
          Route(request) { result =>
            status(result) shouldEqual OK
            up.get(users.verifiedUser.uuid) map { verifiedUserInDbAfterReset =>
              verifiedUserInDbAfterReset should not be empty
              verifiedUserInDBBeforeReset.get.password should not equal verifiedUserInDbAfterReset.get.password
            }
          }
        }
      }
    }
  }

  "Authorization#verify" should {
    implicit lazy val url: SuiteTestURL = SuiteTestURL("/auth/verify")

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(GET, PUT, PATCH, DELETE))

    "forbid access on malformed json input" taggedAs ControllersTestTag in CheckMalformedJSONInput(method = POST)

    "forbid access if logged in" taggedAs ControllersTestTag in {
      val request = FakeJsonRequest(body = "{}", method = POST).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> users.verifiedUser.uuid.toString)
      Route(request) { result =>
        status(result) shouldEqual FORBIDDEN
      }
    }

    "be able to verify input request" taggedAs ControllersTestTag in VerifyInputRequest(method = POST, expectedStatus = BAD_REQUEST) {
      Seq(
        "Missing token" -> Map(),
        "Empty token"   -> Map("token" -> ""),
        "Invalid token" -> Map("token" -> "1234")
      )
    }

    "be able to handle valid verify request" taggedAs ControllersTestTag in {
      up.get(users.notVerifiedUser.uuid).flatMap { notVerifiedUserInDBBeforeReset =>
        notVerifiedUserInDBBeforeReset should not be empty
        notVerifiedUserInDBBeforeReset.get.verified shouldEqual false
        vtp.create(users.notVerifiedUser.uuid).flatMap { token =>
          val request = FakeJsonRequest(Map("token" -> token.toString))
          Route(request) { result =>
            status(result) shouldEqual OK
            up.get(users.notVerifiedUser.uuid) map { notVerifiedUserInDbAfterReset =>
              notVerifiedUserInDbAfterReset should not be empty
              notVerifiedUserInDbAfterReset.get.verified shouldEqual true
            }
          }
        }
      }
    }
  }

  "Authorization#logout" should {
    implicit lazy val url: SuiteTestURL = SuiteTestURL("/auth/logout")

    "forbid access on invalid method type" taggedAs ControllersTestTag in CheckForbiddenMethodTypesAccess(Seq(GET, PUT, PATCH, DELETE))

    "be able to clear session" in {
      val request = FakeJsonRequest(body = "{}", method = POST).withSession(SessionRequest.SESSION_REQUEST_USER_ID_KEY -> users.verifiedUser.uuid.toString)
      Route(request) { result =>
        status(result) shouldEqual OK
        session(result) should be(empty)
      }
    }
  }

}
