package specs

import play.api.inject.guice.GuiceApplicationBuilder
import play.api.{Application, Mode}
import traits.TestApplication

import scala.concurrent.ExecutionContext

abstract class BaseTestSpecWithApplication extends BaseTestSpec with TestApplication {
  implicit private lazy val _application: Application = new GuiceApplicationBuilder().in(Mode.Test).build()

  implicit lazy val ec: ExecutionContext = _application.injector.instanceOf[ExecutionContext]

  def application: Application = _application
}
