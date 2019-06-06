package models.token

import java.sql.Timestamp
import java.time.Duration
import java.util.UUID

import akka.actor.{ActorSystem, Cancellable}
import com.typesafe.config.Config
import javax.inject.{Inject, Singleton}
import models.token
import models.token.ResetMethod.ResetMethod
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
      method = ResetMethod.convert(config.getString("method")),
      link = config.getString("link"),
      keep = config.getDuration("keep"),
      interval = config.getDuration("interval")
    )
  }
}

case class ResetToken(token: UUID, userID: UUID, expiredAt: Timestamp)

class ResetTokenTable(tag: Tag)(implicit up: UserProvider) extends Table[ResetToken](tag, ResetTokenTable.TABLE_NAME) {
  def token     = column[UUID]("TOKEN", O.PrimaryKey, O.SqlType("UUID"))
  def userID    = column[UUID]("USER_ID", O.SqlType("UUID"))
  def expiredAt = column[Timestamp]("EXPIRED_AT")

  def * = (token, userID, expiredAt) <> (ResetToken.tupled, ResetToken.unapply)

  def user = foreignKey("RESET_TOKEN_TABLE_USER_FK", userID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
  )
}

object ResetTokenTable {
  final val TABLE_NAME = "RESET_TOKEN"

  implicit class ResetTokenExtension[C[_]](q: Query[ResetTokenTable, ResetToken, C]) {

    def withUser(implicit up: UserProvider): Query[(ResetTokenTable, UserTable), (ResetToken, User), C] = {
      q.join(up.table).on(_.userID === _.uuid)
    }
  }

}

@Singleton
class ResetTokenProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
                                   conf: Configuration,
                                   lifecycle: ApplicationLifecycle,
                                   system: ActorSystem)(implicit ec: ExecutionContext, up: UserProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger        = LoggerFactory.getLogger(this.getClass)
  private final val configuration = conf.get[ResetTokenConfiguration]("application.auth.reset")

  import dbConfig.profile.api._

  private final val tokens = TableQuery[ResetTokenTable]

  private final val expiredTokensDeleteScheduler: Option[Cancellable] = Option(configuration.interval.getSeconds != 0).collect {
    case true =>
      system.scheduler.schedule(configuration.interval.getSeconds seconds, configuration.interval.getSeconds seconds) {
        expired().map(delete) onComplete {
          case Failure(exception) => logger.warn("Cannot delete expired reset tokens", exception)
          case _                  =>
        }
      }
  }

  def table: TableQuery[ResetTokenTable] = tokens

  def all: Future[Seq[ResetToken]] = db.run(tokens.result)

  def get(token: UUID): Future[Option[ResetToken]] = db.run(tokens.filter(_.token === token).result.headOption)

  def get(token: Future[UUID]): Future[Option[ResetToken]] = token.flatMap(get)

  def findForUser(userID: UUID): Future[Option[ResetToken]] = db.run(tokens.filter(_.userID === userID).result.headOption)

  def findForUser(userID: Future[UUID]): Future[Option[ResetToken]] = userID.flatMap(findForUser)

  def getWithUser(token: UUID): Future[Option[(ResetToken, User)]] = db.run(tokens.withUser.filter(_._1.token === token).result.headOption)

  def getWithUser(token: Future[UUID]): Future[Option[(ResetToken, User)]] = token.flatMap(getWithUser)

  def create(userID: UUID): Future[UUID] = {
    val check = for {
      token <- tokens if token.userID === userID
    } yield token

    db.run(check.result.headOption) flatMap {
      case Some(token) => Future.successful(token.token)
      case None =>
        val token = UUID.randomUUID()
        db.run(tokens += ResetToken(token, userID, TimeUtils.getExpiredAt(configuration.keep))) map {
          case 1 => token
          case _ => throw new RuntimeException("Cannot create ResetToken instance in database: Internal error")
        } onSuccessSideEffect { tokenID =>
          processToken(userID, tokenID)
        }
    }
  }

  def create(userID: Future[UUID]): Future[UUID] = userID.flatMap(create)

  def delete(token: UUID): Future[Int] = db.run(tokens.filter(_.token === token).delete)

  def delete(token: Future[UUID]): Future[Int] = token.flatMap(delete)

  def delete(set: Seq[ResetToken]): Future[Int] = db.run(tokens.filter(t => t.token inSet set.map(_.token)).delete)

  def expired(date: Timestamp = TimeUtils.getCurrentTimestamp): Future[Seq[ResetToken]] = db.run(tokens.filter(_.expiredAt < date).result)

  private def processToken(userID: UUID, tokenID: UUID): Unit = {
    configuration.method match {
      case ResetMethod.EMAIL   => throw new NotImplementedError("Email reset method not implemented")
      case ResetMethod.CONSOLE => logger.info(s"Reset token for user $userID: $tokenID")
      case ResetMethod.NOOP    =>
    }
  }
}
