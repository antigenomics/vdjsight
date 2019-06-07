package traits

import java.util.UUID

import models.token.VerificationTokenProvider
import models.user.UserProvider
import org.scalatest.{Matchers, OptionValues}

import scala.concurrent.Await
import scala.concurrent.duration.Duration

trait DatabaseUsersTestTrait extends Matchers with OptionValues {

  case class TestUserCredentials(login: String, email: String, password: String)

  case class TestUser(uuid: UUID, credentials: TestUserCredentials)

  private def generateNotExistingUser(implicit up: UserProvider): TestUser = {
    val uuid = UUID.randomUUID()
    val credentials = TestUserCredentials(
      login = "tokens-test-not-existing",
      email = "tokens-test-not-existing@mail.com",
      password = "tokens-test-not-existing"
    )

    val isExistByUUID  = Await.result(up.get(uuid), Duration.Inf)
    val isExistByEmail = Await.result(up.getByEmail(credentials.email), Duration.Inf)
    val isExistByLogin = Await.result(up.getByLogin(credentials.login), Duration.Inf)

    isExistByUUID should be(empty)
    isExistByEmail should be(empty)
    isExistByLogin should be(empty)

    TestUser(uuid, credentials)
  }

  private def generateNotVerifiedUser(implicit up: UserProvider): TestUser = {
    val credentials = TestUserCredentials(
      login = "tokens-test-not-verified",
      email = "tokens-test-not-verified@mail.com",
      password = "tokens-test-not-verified"
    )

    val uuid = Await.result(up.create(credentials.login, credentials.email, credentials.password), Duration.Inf)

    val foundByUUID  = Await.result(up.get(uuid), Duration.Inf)
    val foundByEmail = Await.result(up.getByEmail(credentials.email), Duration.Inf)
    val foundByLogin = Await.result(up.getByLogin(credentials.login), Duration.Inf)

    foundByUUID should not be empty
    foundByUUID.get.email shouldEqual credentials.email
    foundByUUID.get.login shouldEqual credentials.login

    foundByEmail should not be empty
    foundByEmail.get.email shouldEqual credentials.email
    foundByEmail.get.login shouldEqual credentials.login

    foundByLogin should not be empty
    foundByLogin.get.email shouldEqual credentials.email
    foundByLogin.get.login shouldEqual credentials.login

    TestUser(uuid, credentials)
  }

  private def generateVerifiedUser(implicit up: UserProvider, vtp: VerificationTokenProvider): TestUser = {
    val credentials = TestUserCredentials(
      login = "tokens-test-verified",
      email = "tokens-test-verified@mail.com",
      password = "tokens-test-verified"
    )

    val uuid = Await.result(up.create(credentials.login, credentials.email, credentials.password), Duration.Inf)

    val foundByUUID  = Await.result(up.get(uuid), Duration.Inf)
    val foundByEmail = Await.result(up.getByEmail(credentials.email), Duration.Inf)
    val foundByLogin = Await.result(up.getByLogin(credentials.login), Duration.Inf)

    foundByUUID should not be empty
    foundByUUID.get.email shouldEqual credentials.email
    foundByUUID.get.login shouldEqual credentials.login

    foundByEmail should not be empty
    foundByEmail.get.email shouldEqual credentials.email
    foundByEmail.get.login shouldEqual credentials.login

    foundByLogin should not be empty
    foundByLogin.get.email shouldEqual credentials.email
    foundByLogin.get.login shouldEqual credentials.login

    val createdToken = Await.result(vtp.create(uuid), Duration.Inf)
    val foundToken   = Await.result(vtp.findForUser(uuid), Duration.Inf)

    foundToken should not be empty
    foundToken.get.token shouldEqual createdToken
    foundToken.get.userID shouldEqual uuid

    val user = Await.result(up.verify(foundToken.get.token), Duration.Inf)

    user should not be empty

    user.get.login shouldEqual credentials.login
    user.get.email shouldEqual credentials.email
    user.get.verified shouldEqual true

    val destroyedToken = Await.result(vtp.findForUser(uuid), Duration.Inf)

    destroyedToken should be(empty)

    TestUser(uuid, credentials)
  }

  private var _notExistingUser: Option[TestUser] = None
  private var _notVerifiedUser: Option[TestUser] = None
  private var _verifiedUser: Option[TestUser]    = None

  final val users = new {
    def notExistingUser(implicit up: UserProvider): TestUser = _notExistingUser.getOrElse {
      _notExistingUser = Some(generateNotExistingUser(up))
      _notExistingUser.get
    }
    def notVerifiedUser(implicit up: UserProvider): TestUser = _notVerifiedUser.getOrElse {
      _notVerifiedUser = Some(generateNotVerifiedUser(up))
      _notVerifiedUser.get
    }
    def verifiedUser(implicit up: UserProvider, vtp: VerificationTokenProvider): TestUser = _verifiedUser.getOrElse {
      _verifiedUser = Some(generateVerifiedUser(up, vtp))
      _verifiedUser.get
    }
  }

}
