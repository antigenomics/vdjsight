package models.user

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import effects.{AbstractEffectEvent, EffectsEventsStream}
import io.github.nremond.SecureHash
import models.token.{ResetTokenProvider, VerificationTokenProvider}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
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
  case class UserCreated(uuid: UUID) extends UserProviderEvent
  case class UserVerified(uuid: UUID) extends UserProviderEvent
  case class UserReset(uuid: UUID) extends UserProviderEvent
  case class UserDeleted(uuid: UUID) extends UserProviderEvent
}

@Singleton
class UserProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  events: EffectsEventsStream
)(
  implicit ec: ExecutionContext
) extends HasDatabaseConfigProvider[JdbcProfile] {

  final private val logger = LoggerFactory.getLogger(this.getClass)

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
        } onSuccessSideEffect { uuid =>
          events.publish(UserProviderEvents.UserCreated(uuid))
        }
    }
  }

  def verify(verificationTokenID: UUID)(implicit vtp: VerificationTokenProvider): Future[Option[User]] = {
    vtp.get(verificationTokenID) flatMap {
      case Some(token) => db.run(users.filter(_.uuid === token.userID).map(_.verified).update(true)).flatMap(_ => get(token.userID))
      case None        => Future.successful(None)
    } onSuccessSideEffect { user =>
      user.foreach(u => events.publish(UserProviderEvents.UserVerified(u.uuid)))
    }
  }

  def reset(resetTokenID: UUID, password: String)(implicit rtp: ResetTokenProvider): Future[Option[User]] = {
    rtp.get(resetTokenID) flatMap {
      case Some(token) =>
        db.run(users.filter(_.uuid === token.userID).map(u => (u.password, u.verified)).update((SecureHash.createHash(password), true)))
          .flatMap(_ => get(token.userID))
      case None => Future.successful(None)
    } onSuccessSideEffect { user =>
      user.foreach(u => events.publish(UserProviderEvents.UserReset(u.uuid)))
    }
  }

  def delete(uuid: UUID): Future[Int] =
    db.run(users.filter(_.uuid === uuid).delete) onSuccessSideEffect { _ =>
      events.publish(UserProviderEvents.UserDeleted(uuid))
    }

  def delete(uuidSet: Set[UUID]): Future[Int] = Future.sequence(uuidSet.map(delete)).map(_.sum)
}
