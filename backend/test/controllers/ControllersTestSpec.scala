package controllers

import akka.stream.Materializer
import org.scalatest.Assertion
import play.api.http.Writeable
import play.api.i18n.{Lang, Messages, MessagesApi}
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{AnyContent, AnyContentAsEmpty, Result, Results}
import play.api.test.FakeRequest
import play.api.test.Helpers._
import specs.BaseTestSpecWithDatabaseAndApplication

import scala.concurrent.Future

abstract class ControllersTestSpec extends BaseTestSpecWithDatabaseAndApplication with Results {
  lazy implicit val messagesApi: MessagesApi = application.injector.instanceOf[MessagesApi]
  lazy implicit val messages: Messages       = messagesApi.preferred(Seq(Lang.defaultLang))
  lazy implicit val mat: Materializer        = application.injector.instanceOf[Materializer]

  def FakeEmptyRequest(method: String)(implicit url: SuiteTestURL) = FakeRequest(method, url.url)

  def FakeJsonRequest(body: String, method: String)(implicit url: SuiteTestURL): FakeRequest[JsValue] =
    FakeRequest(method, url.url).withHeaders("Content-type" -> "application/json").withBody(Json.parse(body))

  def FakeJsonRequest(body: Map[String, String], method: String = POST)(implicit url: SuiteTestURL): FakeRequest[JsValue] =
    FakeJsonRequest(body.map { case (k, v) => s""" "$k": "$v" """ }.mkString("{", ",", "}"), method)

  def MalformedFakeJsonRequest(method: String = POST)(implicit url: SuiteTestURL): FakeRequest[String] =
    FakeRequest(method, url.url).withHeaders("Content-type" -> "application/json").withBody("")

  def Route[A](request: FakeRequest[A])(block: Future[Result] => Future[Assertion])(implicit aW: Writeable[A]): Future[Assertion] = {
    val result = route(application, request)
    result should not be empty
    result.map(block).get
  }

  case class SuiteTestURL(url: String)

  def CheckForbiddenMethodTypesAccess(forbiddenMethodTypes: Seq[String])(implicit url: SuiteTestURL): Assertion = {
    forbiddenMethodTypes.map { method =>
      val request = FakeRequest(method, url.url)
      val result  = route(application, request)
      result should not be empty
      status(result.get) shouldEqual NOT_FOUND
    }.assertAll
  }

  def CheckMalformedJSONInput(method: String)(implicit url: SuiteTestURL): Assertion = {
    val request = MalformedFakeJsonRequest(method)
    val result  = route(application, request)

    result should not be empty

    status(result.get) shouldEqual BAD_REQUEST
    contentAsString(result.get) should include("Invalid Json")
  }

  def VerifyInputRequest(method: String, expectedStatus: Int)(constraints: Seq[(String, Map[String, String])])(implicit url: SuiteTestURL): Assertion = {
    constraints.map {
      case (tag, body) =>
        info(tag)
        val request = FakeJsonRequest(body, method)
        val result  = route(application, request)

        result should not be empty

        status(result.get) shouldEqual expectedStatus
    }.assertAll
  }

  def VerifyFutureInputRequest(method: String, expectedStatus: Int)(constraints: Future[Seq[(String, Map[String, String])]])(
      implicit url: SuiteTestURL): Future[Assertion] = constraints.map(c => VerifyInputRequest(method, expectedStatus)(c))
}
