package traits

import java.util.UUID

import models.token.{VerificationTokenProvider, VerificationTokenProviderEvent, VerificationTokenProviderEvents}
import models.user._
import org.scalatest.{Matchers, OptionValues}

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.language.reflectiveCalls

trait DatabaseUsers extends Matchers with OptionValues with DatabaseProviders with EffectsStream {

  case class TestUserCredentials(login: String, email: String, password: String)

  case class TestUser(uuid: UUID, credentials: TestUserCredentials)

  private def generateNotExistingUser: TestUser = {
    val uuid = UUID.randomUUID()
    val credentials = TestUserCredentials(
      login    = "tokens-test-not-existing",
      email    = "tokens-test-not-existing@mail.com",
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

  private def generateNotVerifiedUser: TestUser = {
    val userEventProbe            = events.probe[UserProviderEvent]
    val userPermissionsEventProbe = events.probe[UserPermissionsProviderEvent]
    val verificationEventProbe    = events.probe[VerificationTokenProviderEvent]
    val credentials = TestUserCredentials(
      login    = "tokens-test-not-verified",
      email    = "tokens-test-not-verified@mail.com",
      password = "tokens-test-not-verified"
    )

    val user = Await.result(up.create(credentials.login, credentials.email, credentials.password), Duration.Inf)

    userEventProbe.expectMsgType[UserProviderEvents.UserCreated]
    userPermissionsEventProbe.expectMsgType[UserPermissionsProviderEvents.UserPermissionsCreated]
    verificationEventProbe.expectMsgType[VerificationTokenProviderEvents.TokenCreated]

    val foundByUUID  = Await.result(up.get(user.uuid), Duration.Inf)
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

    TestUser(user.uuid, credentials)
  }

  private def generateVerifiedUser: TestUser = {
    val userEventProbe            = events.probe[UserProviderEvent]
    val userPermissionsEventProbe = events.probe[UserPermissionsProviderEvent]
    val verificationEventProbe    = events.probe[VerificationTokenProviderEvent]
    val credentials = TestUserCredentials(
      login    = "tokens-test-verified",
      email    = "tokens-test-verified@mail.com",
      password = "tokens-test-verified"
    )

    val user = Await.result(up.create(credentials.login, credentials.email, credentials.password), Duration.Inf)

    userEventProbe.expectMsgType[UserProviderEvents.UserCreated]
    userPermissionsEventProbe.expectMsgType[UserPermissionsProviderEvents.UserPermissionsCreated]
    verificationEventProbe.expectMsgType[VerificationTokenProviderEvents.TokenCreated]

    val foundByUUID  = Await.result(up.get(user.uuid), Duration.Inf)
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

    val createdToken = Await.result(vtp.create(user.uuid), Duration.Inf)
    val foundToken   = Await.result(vtp.findForUser(user.uuid), Duration.Inf)

    foundToken should not be empty
    foundToken.map(_.token) shouldEqual Set(createdToken)

    val verified = Await.result(up.verify(createdToken), Duration.Inf)

    verified should be(true)

    userEventProbe.expectMsgType[UserProviderEvents.UserVerified]
    verificationEventProbe.expectMsgType[VerificationTokenProviderEvents.TokenDeleted]

    val checkUser = Await.result(up.get(user.uuid), Duration.Inf)

    checkUser should not be empty
    checkUser.get.login shouldEqual credentials.login
    checkUser.get.email shouldEqual credentials.email
    checkUser.get.verified shouldEqual true

    TestUser(checkUser.get.uuid, credentials)
  }

  private var _notExistingUser: Option[TestUser] = None
  private var _notVerifiedUser: Option[TestUser] = None
  private var _verifiedUser: Option[TestUser]    = None

  final val users = new {

    def notExistingUser(implicit up: UserProvider): TestUser = _notExistingUser.getOrElse {
      _notExistingUser = Some(generateNotExistingUser)
      _notExistingUser.get
    }

    def notVerifiedUser(implicit up: UserProvider): TestUser = _notVerifiedUser.getOrElse {
      _notVerifiedUser = Some(generateNotVerifiedUser)
      _notVerifiedUser.get
    }

    def verifiedUser(implicit up: UserProvider, vtp: VerificationTokenProvider): TestUser = _verifiedUser.getOrElse {
      _verifiedUser = Some(generateVerifiedUser)
      _verifiedUser.get
    }

  }

}
