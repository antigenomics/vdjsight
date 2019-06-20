package models.token

import java.sql.Timestamp
import java.time.Duration
import java.util.UUID

import akka.actor.{ActorRef, ActorSystem, Cancellable}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.EventStreaming
import models.token
import models.token.VerificationMethod.VerificationMethod
import models.user.{User, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.inject.ApplicationLifecycle
import play.api.{ConfigLoader, Configuration}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.FutureUtils._
import utils.TimeUtils

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.language.{higherKinds, implicitConversions, postfixOps}
import scala.util.Failure

object VerificationMethod extends Enumeration {
  type VerificationMethod = Value
  val EMAIL: token.VerificationMethod.Value   = Value("email")
  val CONSOLE: token.VerificationMethod.Value = Value("console")
  val AUTO: token.VerificationMethod.Value    = Value("auto")
  val NOOP: token.VerificationMethod.Value    = Value("noop")

  def convert(value: String): VerificationMethod = {
    values.find(_.toString == value) match {
      case Some(v) => v
      case None    => throw new RuntimeException(s"Invalid verification method: $value")
    }
  }

  implicit def Method2String(value: VerificationMethod): String = value.toString
  implicit def String2Method(value: String): VerificationMethod = VerificationMethod.convert(value)
}

case class VerificationTokenConfiguration(method: VerificationMethod, link: String, keep: Duration, interval: Duration)

object VerificationTokenConfiguration {
  implicit val verificationTokenConfigurationLoader: ConfigLoader[VerificationTokenConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    VerificationTokenConfiguration(
      method   = VerificationMethod.convert(config.getString("method")),
      link     = config.getString("link"),
      keep     = config.getDuration("keep"),
      interval = config.getDuration("interval")
    )
  }
}

case class VerificationToken(token: UUID, userID: UUID, expiredAt: Timestamp)

class VerificationTokenTable(tag: Tag)(implicit up: UserProvider) extends Table[VerificationToken](tag, VerificationTokenTable.TABLE_NAME) {
  def token     = column[UUID]("token", O.PrimaryKey, O.SqlType("uuid"))
  def userID    = column[UUID]("user_id", O.SqlType("uuid"))
  def expiredAt = column[Timestamp]("expired_at")

  def * = (token, userID, expiredAt) <> (VerificationToken.tupled, VerificationToken.unapply)

  def user = foreignKey("verification_token_table_user_fk", userID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
  )
}

object VerificationTokenTable {
  final val TABLE_NAME = "verification_token"

  implicit class VerificationTokenExtension[C[_]](q: Query[VerificationTokenTable, VerificationToken, C]) {

    def withUser(implicit up: UserProvider): Query[(VerificationTokenTable, UserTable), (VerificationToken, User), C] = {
      q.join(up.table).on(_.userID === _.uuid)
    }
  }
}

trait VerificationTokenProviderEvent

object VerificationTokenProviderEvents {
  case class TokenCreated(token: UUID, userID: UUID, configuration: VerificationTokenConfiguration) extends VerificationTokenProviderEvent
  case class TokenDeleted(token: UUID, userID: UUID, configuration: VerificationTokenConfiguration) extends VerificationTokenProviderEvent
}

@Singleton
class VerificationTokenProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  lifecycle: ApplicationLifecycle
)(implicit ec: ExecutionContext, up: UserProvider)
    extends HasDatabaseConfigProvider[JdbcProfile]
    with EventStreaming[VerificationTokenProviderEvent] {

  final private val logger        = LoggerFactory.getLogger(this.getClass)
  final private val configuration = conf.get[VerificationTokenConfiguration]("application.auth.verification")
  final private val actorSystem   = ActorSystem.create("VerificationTokenProviderActorSystem")
  final private val eventStream   = actorSystem.eventStream

  import dbConfig.profile.api._

  final private val tokens = TableQuery[VerificationTokenTable]

  final private val expiredTokensWithUsersDeleteScheduler: Option[Cancellable] = Option(configuration.interval.getSeconds != 0).collect {
    case true =>
      actorSystem.scheduler.schedule(configuration.interval.getSeconds seconds, configuration.interval.getSeconds seconds) {
        expired().map(_.map(_.token)).flatMap(delete) onComplete {
          case Failure(exception) => logger.warn("Cannot delete expired verification tokens", exception)
          case _                  =>
        }
      }
  }

  lifecycle.addStopHook { () =>
    Future.successful(expiredTokensWithUsersDeleteScheduler.foreach(_.cancel()))
  }

  def subscribe(subscriber: ActorRef): Unit = eventStream.subscribe(subscriber, classOf[VerificationTokenProviderEvent])

  def unsubscribe(subscriber: ActorRef): Unit = eventStream.unsubscribe(subscriber)

  def table: TableQuery[VerificationTokenTable] = tokens

  def all: Future[Seq[VerificationToken]] = db.run(tokens.result)

  def get(token: UUID): Future[Option[VerificationToken]] = db.run(tokens.filter(_.token === token).result.headOption)

  def findForUser(userID: UUID): Future[Set[VerificationToken]] = db.run(tokens.filter(_.userID === userID).result).map(_.toSet)

  def getWithUser(token: UUID): Future[Option[(VerificationToken, User)]] = db.run(tokens.withUser.filter(_._1.token === token).result.headOption)

  def create(userID: UUID): Future[UUID] = {
    val checkUserExist  = up.table.filter(_.uuid === userID).result.headOption
    val checkTokenExist = tokens.filter(_.userID === userID).result.headOption

    db.run((checkUserExist zip checkTokenExist).transactionally) flatMap {
      case (Some(_), Some(token)) => Future.successful(token.token)
      case (Some(_), None) =>
        val token = UUID.randomUUID()
        db.run(tokens += VerificationToken(token, userID, TimeUtils.getExpiredAt(configuration.keep))) map {
          case 1 => token
          case _ => throw new RuntimeException("Cannot create VerificationToken instance in database: Internal error")
        } onSuccessSideEffect { token =>
          eventStream.publish(VerificationTokenProviderEvents.TokenCreated(token, userID, configuration))
        }
      case (None, _) => throw new RuntimeException("Cannot create VerificationToken instance in database: User does not exist")
    }
  }

  def delete(token: UUID): Future[Int] = {
    val userIDAction = tokens.filter(_.token === token).map(_.userID).result.headOption
    val deleteAction = tokens.filter(_.token === token).delete

    db.run((userIDAction zip deleteAction).transactionally) onSuccessSideEffect {
      case (Some(userID), _) => eventStream.publish(VerificationTokenProviderEvents.TokenDeleted(token, userID, configuration))
      case (None, _)         => logger.warn(s"Empty user for verification token: $token")
    } map (_._2)
  }

  def delete(tokenSet: Set[UUID]): Future[Int] = Future.sequence(tokenSet.map(delete)).map(_.sum)

  def deleteForUser(userID: UUID): Future[Int] = findForUser(userID).map(_.map(_.token)).flatMap(delete)

  def expired(date: Timestamp = TimeUtils.getCurrentTimestamp): Future[Set[VerificationToken]] = db.run(tokens.filter(_.expiredAt < date).result).map(_.toSet)
}
