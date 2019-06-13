package traits

import play.api.db.Database

trait TestDatabase {
  def databaseName: String = "default"

  def database: Database
}
