package specs

import org.scalatest._
import org.scalatest.concurrent.Waiters
import org.scalatest.concurrent.Waiters.Waiter
import org.scalatestplus.play.WsScalaTestClient

import scala.concurrent.Future

abstract class BaseTestSpec extends AsyncWordSpec with Matchers with OptionValues with WsScalaTestClient {
  implicit lazy val w: Waiters.Waiter = new Waiter

  implicit class ImmutableIterableAssertionExtension(assertions: scala.collection.immutable.Iterable[Assertion]) {

    def assertAll: Assertion = assertions.foldLeft(Assertions.succeed) {
      case (left, right) => Assertions.assert(left == Assertions.succeed && right == Assertions.succeed)
    }
  }

  implicit class SeqAssertionExtension(assertions: Seq[Assertion]) {
    def assertAll: Assertion = assertions.asInstanceOf[scala.collection.immutable.Iterable[Assertion]].assertAll
  }

  implicit class ListAssertionExtension(assertions: List[Assertion]) {
    def assertAll: Assertion = assertions.asInstanceOf[scala.collection.immutable.Iterable[Assertion]].assertAll
  }

  implicit class SetAssertionExtension(assertions: Set[Assertion]) {
    def assertAll: Assertion = assertions.asInstanceOf[scala.collection.immutable.Iterable[Assertion]].assertAll
  }

  implicit class ImmutableIterableFutureAssertionExtension(futures: scala.collection.immutable.Iterable[Future[Assertion]]) {

    def assertAll: Future[Assertion] = Future.foldLeft(futures)(Assertions.succeed) {
      case (left, right) => Assertions.assert(left == Assertions.succeed && right == Assertions.succeed)
    }
  }

  implicit class SeqFutureAssertionExtension(futures: Seq[Future[Assertion]]) {
    def assertAll: Future[Assertion] = futures.asInstanceOf[scala.collection.immutable.Iterable[Future[Assertion]]].assertAll
  }

  implicit class ListFutureAssertionExtension(futures: List[Future[Assertion]]) {
    def assertAll: Future[Assertion] = futures.asInstanceOf[scala.collection.immutable.Iterable[Future[Assertion]]].assertAll
  }

  implicit class SetFutureAssertionExtension(futures: Set[Future[Assertion]]) {
    def assertAll: Future[Assertion] = futures.asInstanceOf[scala.collection.immutable.Iterable[Future[Assertion]]].assertAll
  }

}
