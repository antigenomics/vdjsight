package models

import play.api.db.{DBApi, Database}
import specs.BaseTestSpecWithApplication

import scala.concurrent.ExecutionContext

abstract class DatabaseProviderTestSpec(databaseName: String = "default") extends BaseTestSpecWithApplication {
  lazy implicit val database: Database   = app.injector.instanceOf[DBApi].database(databaseName)
  lazy implicit val ec: ExecutionContext = app.injector.instanceOf[ExecutionContext]
}
