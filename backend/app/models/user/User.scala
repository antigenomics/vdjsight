package models.user

import java.util.UUID

import io.github.nremond.SecureHash
import javax.inject.{Inject, Singleton}
import models.token.VerificationTokenProvider
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

import scala.concurrent.{ExecutionContext, Future}
import scala.language.higherKinds
import scala.util.{Failure, Success}

case class User(uuid: UUID, login: String, email: String, verified: Boolean, password: String)

class UserTable(tag: Tag) extends Table[User](tag, UserTable.TABLE_NAME) {
  def uuid     = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def login    = column[String]("login", O.Unique, O.Length(64))
  def email    = column[String]("email", O.Unique, O.Length(255))
  def verified = column[Boolean]("verified")
  def password = column[String]("password", O.Length(255))

  def * = (uuid, login, email, verified, password) <> (User.tupled, User.unapply)
}

object UserTable {
  final val TABLE_NAME = "user"
}

@Singleton
class UserProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val users = TableQuery[UserTable]

  def table: TableQuery[UserTable] = users

  def isUserWithEmailExist(email: String): Future[Boolean] = {
    db.run(users.filter(_.email === email).result.headOption.map(_.isDefined))
  }

  def isUserWithLoginExist(login: String): Future[Boolean] = {
    db.run(users.filter(_.email === login).result.headOption.map(_.isDefined))
  }

  def isUserWithEmailOrLoginExist(email: String, login: String): Future[(Boolean, Boolean)] = {
    val byEmail = users.filter(_.email === email).result.headOption.map(_.isDefined)
    val byLogin = users.filter(_.login === login).result.headOption.map(_.isDefined)
    val actions = byEmail zip byLogin

    db.run(actions.transactionally)
  }

  def all: Future[Seq[User]] = db.run(users.result)

  def get(uuid: UUID): Future[Option[User]] = db.run(users.filter(_.uuid === uuid).result.headOption)

  def get(uuid: Future[UUID]): Future[Option[User]] = uuid.flatMap(get)

  def get(uuidSet: Set[UUID]): Future[Seq[User]] = db.run(users.filter(u => u.uuid inSet uuidSet).result)

  def getByEmail(email: String): Future[Option[User]] = db.run(users.filter(_.email === email).result.headOption)

  def getByEmail(email: Future[String]): Future[Option[User]] = email.flatMap(getByEmail)

  def getByLogin(login: String): Future[Option[User]] = db.run(users.filter(_.login === login).result.headOption)

  def getByLogin(login: Future[String]): Future[Option[User]] = login.flatMap(getByLogin)

  def create(login: String, email: String, password: String): Future[UUID] = {
    val check = for {
      user <- users if user.login === login || user.email === email
    } yield user

    db.run(check.result.headOption) flatMap {
      case Some(_) => Future.failed(new RuntimeException("Cannot create User instance in database: User already exist"))
      case None =>
        val uuid = UUID.randomUUID()
        db.run(users += User(uuid, login, email, verified = false, SecureHash.createHash(password))) map {
          case 1 => uuid
          case _ => throw new RuntimeException("Cannot create User instance in database: Internal error")
        }
    }
  }

  def verify(tokenID: UUID)(implicit vtp: VerificationTokenProvider): Future[Option[User]] = {
    vtp.get(tokenID) flatMap {
      case Some(token) =>
        db.run(DBIO.seq(users.filter(_.uuid === token.userID).map(_.verified).update(true), vtp.table.filter(_.token === token.token).delete))
          .transform {
            case Success(_) => Success(get(token.userID))
            case Failure(_) => throw new RuntimeException("Cannot verify user instance in database: Internal error")
          }
          .flatten
      case None => Future.successful(None)
    }
  }

  def delete(uuid: UUID): Future[Int] = db.run(users.filter(_.uuid === uuid).delete)

  def delete(uuid: Future[UUID]): Future[Int] = uuid.flatMap(delete)

  def delete(uuidSet: Set[UUID]): Future[Int] = db.run(users.filter(t => t.uuid inSet uuidSet).delete)
}
