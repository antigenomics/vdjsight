package models.user

import slick.jdbc.H2Profile.api._
import slick.lifted.Tag

import scala.language.higherKinds

case class User(id: Long, login: String, email: String, verified: Boolean, private[authorization] val password: String)

class UserTable(tag: Tag) extends Table[User](tag, UserTable.TABLE_NAME) {
  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)
  def login = column[String]("LOGIN", O.Length(64))
  def email = column[String]("EMAIL", O.Unique, O.Length(128))
  def verified = column[Boolean]("VERIFIED")
  def password = column[String]("PASSWORD", O.Length(255))

  def * = (id, login, email, verified, password) <> (User.tupled, User.unapply)
}

object UserTable {
  final val TABLE_NAME = "USER"
}
