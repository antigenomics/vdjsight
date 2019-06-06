package models.token

import java.util.UUID

import models.user.UserProvider
import specs.BaseTestSpecWithApplication

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.language.reflectiveCalls

abstract class BaseTokenTestSpec extends BaseTestSpecWithApplication {
  implicit lazy val up : UserProvider              = app.injector.instanceOf[UserProvider]
  implicit lazy val rtp: ResetTokenProvider        = app.injector.instanceOf[ResetTokenProvider]
  implicit lazy val vtp: VerificationTokenProvider = app.injector.instanceOf[VerificationTokenProvider]

  trait NotExistingUser {
    private final val _credentials = new {
      lazy val uuid    : UUID   = UUID.randomUUID()
      lazy val login   : String = "tokens-test-not-existing"
      lazy val email   : String = "tokens-test-not-existing@mail.com"
      lazy val password: String = "tokens-test-not-existing"
    }

    private final val _isExistByUUID  = Await.result(up.get(_credentials.uuid), Duration.Inf)
    private final val _isExistByEmail = Await.result(up.getByEmail(_credentials.email), Duration.Inf)
    private final val _isExistByLogin = Await.result(up.getByLogin(_credentials.login), Duration.Inf)

    _isExistByUUID should be(empty)
    _isExistByEmail should be(empty)
    _isExistByLogin should be(empty)

    final val credentials = _credentials
  }

  final val fixtures = new {
    lazy val nonExistingUser: NotExistingUser = new NotExistingUser {}
  }

}
