package actions

import play.api.mvc.{Action, BodyParser, Request, Result}
import utils.FutureUtils._

import scala.concurrent.duration.FiniteDuration
import scala.concurrent.{ExecutionContext, Future}

case class DelayedAction[A](time: FiniteDuration)(action: Action[A])(implicit ec: ExecutionContext) extends Action[A] {
  override def apply(request: Request[A]): Future[Result] = DelayedFuture(time)(action(request)).flatten

  override def parser: BodyParser[A] = action.parser

  override def executionContext: ExecutionContext = action.executionContext
}
