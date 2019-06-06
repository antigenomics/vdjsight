package specs

import play.api.inject.guice.GuiceApplicationBuilder
import play.api.{Application, Mode}

abstract class BaseTestSpecWithApplication extends BaseTestSpec {
  lazy implicit val app: Application = new GuiceApplicationBuilder().in(Mode.Test).build()
}
