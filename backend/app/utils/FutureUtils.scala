package utils

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

object FutureUtils {

  implicit class FutureSideEffectExtension[T](future: Future[T]) {
    def onSuccessSideEffect[U](f: T => U)(implicit ec: ExecutionContext): Future[T] = {
      future onComplete {
        case Success(value) => f(value)
        case Failure(_)     =>
      }
      future
    }
  }

}
