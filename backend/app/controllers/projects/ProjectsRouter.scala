package controllers.projects

import javax.inject.Inject
import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter
import play.api.routing.sird._

class ProjectsRouter @Inject()(controller: ProjectsController) extends SimpleRouter {
  override def routes: Routes = {
    case GET(p"/list")  => controller.list
    case POST(p"/list") => controller.create
  }
}