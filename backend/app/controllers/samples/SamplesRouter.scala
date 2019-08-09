package controllers.samples

import com.google.inject.Inject
import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter
import play.api.routing.sird._
import utils.UUIDUtils._

import scala.language.implicitConversions

class SamplesRouter @Inject()(controller: SamplesController) extends SimpleRouter {
  override def routes: Routes = {
    case GET(p"/$projectLinkUUID/list")    => controller.list(projectLinkUUID)
    case POST(p"/$projectLinkUUID/create") => controller.create(projectLinkUUID)
    case POST(p"/$projectLinkUUID/update") => controller.update(projectLinkUUID)
    case POST(p"/$projectLinkUUID/delete") => controller.delete(projectLinkUUID)
  }
}
