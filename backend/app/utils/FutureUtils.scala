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

  object DelayedFuture {

    import java.util.{Date, Timer, TimerTask}

    import scala.concurrent._
    import scala.concurrent.duration.FiniteDuration
    import scala.util.Try

    private val timer = new Timer(true)

    private def makeTask[T](body: => T)(schedule: TimerTask => Unit)(implicit ctx: ExecutionContext): Future[T] = {
      val promise = Promise[T]()
      schedule(
        new TimerTask {
          def run(): Unit = {
            // IMPORTANT: The timer task just starts the execution on the passed
            // ExecutionContext and is thus almost instantaneous (making it
            // practical to use a single  Timer - hence a single background thread).
            ctx.execute(() => {
              promise.complete(Try(body))
            })
          }
        }
      )
      promise.future
    }

    def apply[T](delay: Long)(body: => T)(implicit ctx: ExecutionContext): Future[T] = {
      makeTask(body)(timer.schedule(_, delay))
    }

    def apply[T](date: Date)(body: => T)(implicit ctx: ExecutionContext): Future[T] = {
      makeTask(body)(timer.schedule(_, date))
    }

    def apply[T](delay: FiniteDuration)(body: => T)(implicit ctx: ExecutionContext): Future[T] = {
      makeTask(body)(timer.schedule(_, delay.toMillis))
    }
  }

}
