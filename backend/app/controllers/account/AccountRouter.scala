package controllers.account

import com.google.inject.Inject
import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter
import play.api.routing.sird._

class AccountRouter @Inject()(controller: AccountController) extends SimpleRouter {
  override def routes: Routes = {
    case GET(p"/info") => controller.info
  }
}
