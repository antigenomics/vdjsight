package actions

import java.util.UUID

import javax.inject.Inject
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

case class SessionRequest[A](userID: Option[UUID], request: Request[A]) extends WrappedRequest[A](request)

object SessionRequest {
  final val SESSION_REQUEST_USER_ID_KEY = "user-id"
}

class SessionRequestAction @Inject()(val parser: BodyParsers.Default)(implicit val ec: ExecutionContext)
  extends ActionBuilder[SessionRequest, AnyContent] with ActionTransformer[Request, SessionRequest] {

  override protected def executionContext: ExecutionContext = ec

  override protected def transform[A](request: Request[A]): Future[SessionRequest[A]] = Future.successful {
    SessionRequest(request.session.get(SessionRequest.SESSION_REQUEST_USER_ID_KEY).map(UUID.fromString), request)
  }
}

object SessionRequestAction {

  def authorizedOnly(implicit ec: ExecutionContext): ActionFilter[SessionRequest] = new ActionFilter[SessionRequest] {
    override protected def executionContext: ExecutionContext = ec

    override protected def filter[A](request: SessionRequest[A]): Future[Option[Result]] = Future.successful {
      if (request.userID.isDefined) {
        None
      } else {
        Some(Results.Unauthorized)
      }
    }
  }

  def unauthorizedOnly(implicit ec: ExecutionContext): ActionFilter[SessionRequest] = new ActionFilter[SessionRequest] {
    override protected def executionContext: ExecutionContext = ec

    override protected def filter[A](request: SessionRequest[A]): Future[Option[Result]] = Future.successful {
      if (request.userID.isDefined) {
        Some(Results.Forbidden)
      } else {
        None
      }
    }
  }

}