package models.user

import java.util.UUID

import javax.inject.{Inject, Singleton}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.H2Profile.api._
import slick.jdbc.JdbcProfile
import slick.lifted.Tag

import scala.language.higherKinds

case class User(uuid: UUID, login: String, email: String, verified: Boolean, password: String)

class UserTable(tag: Tag) extends Table[User](tag, UserTable.TABLE_NAME) {
  def uuid = column[UUID]("UUID", O.PrimaryKey, O.SqlType("UUID"))
  def login = column[String]("LOGIN", O.Length(64))
  def email = column[String]("EMAIL", O.Unique, O.Length(255))
  def verified = column[Boolean]("VERIFIED")
  def password = column[String]("PASSWORD", O.Length(255))

  def * = (uuid, login, email, verified, password) <> (User.tupled, User.unapply)

  def email_idx = index("EMAIL_IDX", email, unique = true)
}

object UserTable {
  final val TABLE_NAME = "USER"
}

@Singleton
class UserProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)
  extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val table = TableQuery[UserTable]

  def getTable: TableQuery[UserTable] = table
}
