package models.user

import java.util.UUID

import io.github.nremond.SecureHash
import javax.inject.{Inject, Singleton}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.H2Profile.api._
import slick.jdbc.JdbcProfile
import slick.lifted.Tag

import scala.concurrent.{ExecutionContext, Future}
import scala.language.higherKinds

case class User(uuid: UUID, login: String, email: String, verified: Boolean, password: String)

class UserTable(tag: Tag) extends Table[User](tag, UserTable.TABLE_NAME) {
  def uuid = column[UUID]("UUID", O.PrimaryKey, O.SqlType("UUID"))
  def login = column[String]("LOGIN", O.Unique, O.Length(64))
  def email = column[String]("EMAIL", O.Unique, O.Length(255))
  def verified = column[Boolean]("VERIFIED")
  def password = column[String]("PASSWORD", O.Length(255))

  def * = (uuid, login, email, verified, password) <> (User.tupled, User.unapply)

  def email_idx = index("USER_TABLE_EMAIL_IDX", email, unique = true)
}

object UserTable {
  final val TABLE_NAME = "USER"
}

@Singleton
class UserProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext)
  extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val users = TableQuery[UserTable]

  def getTable: TableQuery[UserTable] = users

  def isVerifiedUserWithEmailExist(email: String): Future[Boolean] = {
    db.run(users.filter(_.email === email).result.headOption).map(_.map(_.verified)).map(_.getOrElse(false))
  }

  def all: Future[Seq[User]] = db.run(users.result)

  def get(uuid: UUID): Future[Option[User]] = db.run(users.filter(_.uuid === uuid).result.headOption)

  def get(uuid: Future[UUID]): Future[Option[User]] = uuid.flatMap(get)

  def getByEmail(email: String): Future[Option[User]] = db.run(users.filter(_.email === email).result.headOption)

  def getByEmail(email: Future[String]): Future[Option[User]] = email.flatMap(getByEmail)

  def getByLogin(login: String): Future[Option[User]] = db.run(users.filter(_.login === login).result.headOption)

  def getByLogin(login: Future[String]): Future[Option[User]] = login.flatMap(getByLogin)

  def create(login: String, email: String, password: String): Future[UUID] = {
    db.run((users returning users.map(_.uuid)) += User(UUID.randomUUID(), login, email, verified = false, SecureHash.createHash(password)))
  }
}
