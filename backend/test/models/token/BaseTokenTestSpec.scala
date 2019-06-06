package models.token

import java.util.UUID

import models.user.UserProvider
import specs.BaseTestSpecWithApplication

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.language.reflectiveCalls

abstract class BaseTokenTestSpec extends BaseTestSpecWithApplication {
  implicit lazy val up: UserProvider               = app.injector.instanceOf[UserProvider]
  implicit lazy val rtp: ResetTokenProvider        = app.injector.instanceOf[ResetTokenProvider]
  implicit lazy val vtp: VerificationTokenProvider = app.injector.instanceOf[VerificationTokenProvider]

  trait NotExistingUser {
    private final val _uuid = UUID.randomUUID()
    private final val _credentials = new {
      lazy val login: String    = "tokens-test-not-existing"
      lazy val email: String    = "tokens-test-not-existing@mail.com"
      lazy val password: String = "tokens-test-not-existing"
    }

    private final val _isExistByUUID  = Await.result(up.get(_uuid), Duration.Inf)
    private final val _isExistByEmail = Await.result(up.getByEmail(_credentials.email), Duration.Inf)
    private final val _isExistByLogin = Await.result(up.getByLogin(_credentials.login), Duration.Inf)

    _isExistByUUID should be(empty)
    _isExistByEmail should be(empty)
    _isExistByLogin should be(empty)

    final val uuid        = _uuid
    final val credentials = _credentials
  }

  trait NotVerifiedUser {
    private final val _credentials = new {
      lazy val login: String    = "tokens-test-not-verified"
      lazy val email: String    = "tokens-test-not-verified@mail.com"
      lazy val password: String = "tokens-test-not-verified"
    }

    private final val _userUUID = up.create(_credentials.login, _credentials.email, _credentials.password)

    private final val _isExistByUUID  = Await.result(up.get(_userUUID), Duration.Inf)
    private final val _isExistByEmail = Await.result(up.getByEmail(_credentials.email), Duration.Inf)
    private final val _isExistByLogin = Await.result(up.getByLogin(_credentials.login), Duration.Inf)

    _isExistByUUID should not be empty
    _isExistByEmail should not be empty
    _isExistByLogin should not be empty

    final val uuid        = _userUUID
    final val credentials = _credentials
  }

  final val fixtures = new {
    lazy val notExistingUser: NotExistingUser = new NotExistingUser {}
    lazy val notVerifiedUser: NotVerifiedUser = new NotVerifiedUser {}
  }

}
