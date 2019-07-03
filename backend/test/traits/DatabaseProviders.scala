package traits

import models.project.{ProjectLinkProvider, ProjectProvider}
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.{UserPermissionsProvider, UserProvider}
import play.api.Application

trait DatabaseProviders {
  implicit lazy val up: UserProvider               = application.injector.instanceOf[UserProvider]
  implicit lazy val upp: UserPermissionsProvider   = application.injector.instanceOf[UserPermissionsProvider]
  implicit lazy val rtp: ResetTokenProvider        = application.injector.instanceOf[ResetTokenProvider]
  implicit lazy val vtp: VerificationTokenProvider = application.injector.instanceOf[VerificationTokenProvider]
  implicit lazy val pp: ProjectProvider            = application.injector.instanceOf[ProjectProvider]
  implicit lazy val plp: ProjectLinkProvider       = application.injector.instanceOf[ProjectLinkProvider]

  def application: Application
}
