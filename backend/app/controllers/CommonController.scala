package controllers

import com.google.inject.Singleton
import javax.inject.Inject
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import server.ServerResponse

@Singleton
class CommonController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def ping: Action[AnyContent] = Action {
    Ok(ServerResponse.EMPTY)
  }

}
