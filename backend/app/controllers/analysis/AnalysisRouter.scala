package controllers.analysis

import com.google.inject.Inject
import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter
import play.api.routing.sird._
import utils.UUIDUtils._

class AnalysisRouter @Inject()(controller: AnalysisController) extends SimpleRouter {
  override def routes: Routes = {
    case POST(p"/${projectLinkUUID}/${sampleLinkUUID}/clonotypes") => controller.clonotypes(projectLinkUUID, sampleLinkUUID)
  }
}
