package controllers.authorization

import com.google.inject.Inject
import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter
import play.api.routing.sird._

class AuthorizationRouter @Inject()(controller: AuthorizationController)
    extends SimpleRouter {

  override def routes: Routes = {
    case POST(p"/login/")  => controller.login
    case POST(p"/signup/") => controller.signup
    case POST(p"/reset/")  => controller.reset
    case POST(p"/change/") => controller.change
    case POST(p"/verify/") => controller.verify
    case POST(p"/logout/") => controller.logout
  }

}
