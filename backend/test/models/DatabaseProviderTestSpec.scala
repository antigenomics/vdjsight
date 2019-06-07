package models

import models.token.{ResetTokenProvider, VerificationTokenProvider}
import models.user.UserProvider
import org.scalatest.BeforeAndAfterAll
import play.api.db.evolutions.Evolutions
import play.api.db.{DBApi, Database}
import specs.BaseTestSpecWithApplication

import scala.concurrent.ExecutionContext

abstract class DatabaseProviderTestSpec(databaseName: String = "default") extends BaseTestSpecWithApplication with BeforeAndAfterAll {
  lazy implicit val database: Database   = app.injector.instanceOf[DBApi].database(databaseName)
  lazy implicit val ec: ExecutionContext = app.injector.instanceOf[ExecutionContext]

  lazy implicit val up: UserProvider               = app.injector.instanceOf[UserProvider]
  lazy implicit val rtp: ResetTokenProvider        = app.injector.instanceOf[ResetTokenProvider]
  lazy implicit val vtp: VerificationTokenProvider = app.injector.instanceOf[VerificationTokenProvider]

  override def afterAll(): Unit = {
    Evolutions.cleanupEvolutions(database)
    Evolutions.applyEvolutions(database)
    super.afterAll()
  }
}
