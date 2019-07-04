package models.user

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import effects.{AbstractEffectEvent, EffectsEventsStream}
import io.github.nremond.SecureHash
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import play.api.Logging
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import server.{BadRequestException, InternalServerErrorException}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.FutureUtils._

import scala.concurrent.{ExecutionContext, Future}
import scala.language.higherKinds

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

trait UserProviderEvent extends AbstractEffectEvent

object UserProviderEvents {
  case class UserCreated(user: User) extends UserProviderEvent
  case class UserVerified(uuid: UUID) extends UserProviderEvent
  case class UserReset(uuid: UUID) extends UserProviderEvent
  case class UserDeleted(user: User) extends UserProviderEvent
}

@Singleton
class UserProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  events: EffectsEventsStream
)(
  implicit ec: ExecutionContext
) extends HasDatabaseConfigProvider[JdbcProfile]
    with Logging {

  import dbConfig.profile.api._

  final private val users = TableQuery[UserTable]

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

  def getByEmail(email: String): Future[Option[User]] = db.run(users.filter(_.email === email).result.headOption)

  def getByLogin(login: String): Future[Option[User]] = db.run(users.filter(_.login === login).result.headOption)

  def getByEmailAndPassword(email: String, password: String): Future[Option[User]] = {
    getByEmail(email).map(_.filter(u => SecureHash.validatePassword(password, u.password)))
  }

  def create(login: String, email: String, password: String): Future[User] = {
    val actions = users.filter(u => u.login === login || u.email === email).result.headOption flatMap {
        case Some(_) => DBIO.failed(BadRequestException("Cannot create User instance in database: User already exist"))
        case None =>
          val uuid = UUID.randomUUID()
          val user = User(
            uuid     = uuid,
            login    = login,
            email    = email,
            verified = false,
            password = SecureHash.createHash(password)
          )
          (users += user) flatMap {
            case 0 => DBIO.failed(InternalServerErrorException("Cannot create User instance in database: Database error"))
            case _ => DBIO.successful(user)
          }
      }

    db.run(actions.transactionally) onSuccessSideEffect { user =>
      events.publish(UserProviderEvents.UserCreated(user))
    }
  }

  def verify(tokenID: UUID)(implicit vtp: VerificationTokenProvider): Future[Boolean] = {
    val actions = vtp.table.filter(_.token === tokenID).result.headOption flatMap {
        case Some(token) =>
          users.filter(_.uuid === token.userID).map(_.verified).update(true) map {
            case 0 => false
            case _ =>
              events.publish(UserProviderEvents.UserVerified(token.userID))
              true
          }
        case None => DBIO.successful(false)
      }

    db.run(actions.transactionally)
  }

  def reset(tokenID: UUID, password: String)(implicit rtp: ResetTokenProvider): Future[Boolean] = {
    val actions = rtp.table.filter(_.token === tokenID).result.headOption flatMap {
        case Some(token) =>
          users.filter(_.uuid === token.userID).map(u => (u.password, u.verified)).update((SecureHash.createHash(password), true)) map {
            case 0 => false
            case _ =>
              events.publish(UserProviderEvents.UserReset(token.userID))
              true
          }
        case None => DBIO.successful(false)
      }

    db.run(actions.transactionally)
  }

  def delete(uuid: UUID): Future[Boolean] = {
    val actions = users.filter(_.uuid === uuid).result.headOption flatMap {
        case Some(user) =>
          users.filter(_.uuid === uuid).delete map {
            case 0 => false
            case _ =>
              events.publish(UserProviderEvents.UserDeleted(user))
              true
          }
        case None => DBIO.failed(BadRequestException("Cannot delete User instance in database: User does not exist"))
      }
    db.run(actions.transactionally)
  }

}
