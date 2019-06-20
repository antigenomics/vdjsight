package traits

import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.UserProvider
import play.api.Application

trait DatabaseProviders {
  implicit lazy val up: UserProvider               = application.injector.instanceOf[UserProvider]
  implicit lazy val rtp: ResetTokenProvider        = application.injector.instanceOf[ResetTokenProvider]
  implicit lazy val vtp: VerificationTokenProvider = application.injector.instanceOf[VerificationTokenProvider]

  def application: Application
}
