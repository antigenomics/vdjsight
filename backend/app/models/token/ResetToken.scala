package models.token

import java.sql.Timestamp
import java.time.Duration
import java.util.UUID

import akka.actor.{ActorSystem, Cancellable}
import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import models.token
import models.token.ResetMethod.ResetMethod
import models.user.{User, UserProvider, UserTable}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.inject.ApplicationLifecycle
import play.api.{ConfigLoader, Configuration, Logging}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag
import utils.TimeUtils

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}
import scala.language.{higherKinds, implicitConversions, postfixOps}
import scala.util.Failure

object ResetMethod extends Enumeration {
  type ResetMethod = Value

  val EMAIL: token.ResetMethod.Value   = Value("email")
  val CONSOLE: token.ResetMethod.Value = Value("console")
  val NOOP: token.ResetMethod.Value    = Value("noop")

  def convert(value: String): ResetMethod = {
    values.find(_.toString == value) match {
      case Some(v) => v
      case None    => throw new RuntimeException(s"Invalid reset method: $value")
    }
  }

  implicit def Method2String(value: ResetMethod): String = value.toString
  implicit def String2Method(value: String): ResetMethod = ResetMethod.convert(value)
}

case class ResetTokenConfiguration(method: ResetMethod, link: String, keep: Duration, interval: Duration)

object ResetTokenConfiguration {
  implicit val resetTokenConfigurationLoader: ConfigLoader[ResetTokenConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    ResetTokenConfiguration(
      method   = ResetMethod.convert(config.getString("method")),
      link     = config.getString("link"),
      keep     = config.getDuration("keep"),
      interval = config.getDuration("interval")
    )
  }
}

case class ResetToken(token: UUID, userID: UUID, expiredAt: Timestamp)

class ResetTokenTable(tag: Tag)(implicit up: UserProvider) extends Table[ResetToken](tag, ResetTokenTable.TABLE_NAME) {
  def token     = column[UUID]("token", O.PrimaryKey, O.SqlType("uuid"))
  def userID    = column[UUID]("user_id", O.SqlType("uuid"))
  def expiredAt = column[Timestamp]("expired_at")

  def * = (token, userID, expiredAt) <> (ResetToken.tupled, ResetToken.unapply)

  def user = foreignKey("reset_token_table_user_fk", userID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
  )
}

object ResetTokenTable {
  final val TABLE_NAME = "reset_token"

  implicit class ResetTokenExtension[C[_]](q: Query[ResetTokenTable, ResetToken, C]) {

    def withUser(implicit up: UserProvider): Query[(ResetTokenTable, UserTable), (ResetToken, User), C] = {
      q.join(up.table).on(_.userID === _.uuid)
    }
  }
}

trait ResetTokenProviderEvent extends AbstractEffectEvent

object ResetTokenProviderEvents {
  case class TokenCreated(token: ResetToken, configuration: ResetTokenConfiguration) extends ResetTokenProviderEvent
  case class TokenDeleted(token: ResetToken, configuration: ResetTokenConfiguration) extends ResetTokenProviderEvent
}

@Singleton
class ResetTokenProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  lifecycle: ApplicationLifecycle,
  actorSystem: ActorSystem,
  events: EffectsEventsStream
)(
  implicit ec: ExecutionContext,
  up: UserProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with Logging {

  final private val configuration = conf.get[ResetTokenConfiguration]("application.auth.reset")

  import dbConfig.profile.api._

  final private val tokens = TableQuery[ResetTokenTable]

  final private val expiredTokensDeleteScheduler: Option[Cancellable] = Option(!configuration.interval.isZero).collect {
    case true =>
      actorSystem.scheduler.schedule(configuration.interval.getSeconds seconds, configuration.interval.getSeconds seconds) {
        expired().map(_.map(_.token)).flatMap(delete) onComplete {
          case Failure(exception) => logger.warn("Cannot delete expired reset tokens", exception)
          case _                  =>
        }
      }
  }

  lifecycle.addStopHook { () =>
    Future.successful(expiredTokensDeleteScheduler.foreach(_.cancel()))
  }

  def table: TableQuery[ResetTokenTable] = tokens

  def all: Future[Seq[ResetToken]] = db.run(tokens.result)

  def get(token: UUID): Future[Option[ResetToken]] = db.run(tokens.filter(_.token === token).result.headOption)

  def findForUser(userID: UUID): Future[Set[ResetToken]] = db.run(tokens.filter(_.userID === userID).result).map(_.toSet)

  def getWithUser(token: UUID): Future[Option[(ResetToken, User)]] = db.run(tokens.withUser.filter(_._1.token === token).result.headOption)

  def create(userID: UUID): Future[ResetToken] = {
    val actions = up.table.filter(_.uuid === userID).result.headOption flatMap {
        case Some(_) =>
          tokens.filter(_.userID === userID).result.headOption flatMap {
            case Some(token) => DBIO.successful(token)
            case None =>
              val uuid = UUID.randomUUID()
              val token = ResetToken(
                token     = uuid,
                userID    = userID,
                expiredAt = TimeUtils.getExpiredAt(configuration.keep)
              )
              (tokens += token) flatMap {
                case 0 => DBIO.failed(new Exception("Cannot create VerificationToken instance in database: Unknown error"))
                case _ =>
                  events.publish(ResetTokenProviderEvents.TokenCreated(token, configuration))
                  DBIO.successful(token)
              }
          }
        case None => DBIO.failed(new Exception("Cannot create VerificationToken instance in database: User does not exist"))
      }

    db.run(actions.transactionally)
  }

  def delete(token: UUID): Future[Boolean] = {
    val actions = tokens.filter(_.token === token).result.headOption flatMap {
        case Some(t) =>
          tokens.filter(_.token === token).delete flatMap {
            case 0 => DBIO.failed(new Exception("Cannot delete ResetToken instance in database: Unknown error"))
            case _ =>
              events.publish(ResetTokenProviderEvents.TokenDeleted(t, configuration))
              DBIO.successful(true)
          }
        case None => DBIO.failed(new Exception("Cannot delete ResetToken instance in database: Token does not exist"))
      }

    db.run(actions.transactionally)
  }

  def delete(tokenSet: Set[UUID]): Future[Boolean] = Future.sequence(tokenSet.map(delete)).map(_.forall(_ == true))

  def deleteForUser(userID: UUID): Future[Boolean] = findForUser(userID).map(_.map(_.token)).flatMap(delete)

  def expired(date: Timestamp = TimeUtils.getCurrentTimestamp): Future[Set[ResetToken]] = db.run(tokens.filter(_.expiredAt < date).result).map(_.toSet)
}
