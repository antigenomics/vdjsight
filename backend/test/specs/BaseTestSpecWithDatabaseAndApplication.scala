package specs

import org.scalatest.BeforeAndAfterAll
import play.api.db.evolutions.Evolutions
import play.api.db.{DBApi, Database}
import traits.TestDatabase

abstract class BaseTestSpecWithDatabaseAndApplication extends BaseTestSpecWithApplication with TestDatabase with BeforeAndAfterAll {
  lazy private implicit val _database: Database = application.injector.instanceOf[DBApi].database(databaseName)

  def database: Database = _database

  override protected def beforeAll(): Unit = {
    Evolutions.cleanupEvolutions(_database)
    Evolutions.applyEvolutions(_database)
    super.beforeAll()
  }

  override protected def afterAll(): Unit = {
    Evolutions.cleanupEvolutions(_database)
    Evolutions.applyEvolutions(_database)
    super.afterAll()
  }

}
