package traits

import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.UserProvider
import play.api.Application

trait DatabaseProviders {
  lazy implicit val up: UserProvider               = application.injector.instanceOf[UserProvider]
  lazy implicit val rtp: ResetTokenProvider        = application.injector.instanceOf[ResetTokenProvider]
  lazy implicit val vtp: VerificationTokenProvider = application.injector.instanceOf[VerificationTokenProvider]

  def application: Application
}
