package models.token

import java.sql.Timestamp
import java.time.Duration
import java.util.UUID

import akka.actor.{ActorSystem, Cancellable}
import com.typesafe.config.Config
import javax.inject.{Inject, Singleton}
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
      method = VerificationMethod.convert(config.getString("method")),
      link = config.getString("link"),
      keep = config.getDuration("keep"),
      interval = config.getDuration("interval")
    )
  }
}

case class VerificationToken(token: UUID, userID: UUID, expiredAt: Timestamp)

class VerificationTokenTable(tag: Tag)(implicit up: UserProvider) extends Table[VerificationToken](tag, VerificationTokenTable.TABLE_NAME) {
  def token     = column[UUID]("TOKEN", O.PrimaryKey, O.SqlType("UUID"))
  def userID    = column[UUID]("USER_ID", O.SqlType("UUID"))
  def expiredAt = column[Timestamp]("EXPIRED_AT")

  def * = (token, userID, expiredAt) <> (VerificationToken.tupled, VerificationToken.unapply)

  def user = foreignKey("VERIFICATION_TOKEN_TABLE_USER_FK", userID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
  )
}

object VerificationTokenTable {
  final val TABLE_NAME = "VERIFICATION_TOKEN"

  implicit class VerificationTokenExtension[C[_]](q: Query[VerificationTokenTable, VerificationToken, C]) {

    def withUser(implicit up: UserProvider): Query[(VerificationTokenTable, UserTable), (VerificationToken, User), C] = {
      q.join(up.table).on(_.userID === _.uuid)
    }
  }

}

@Singleton
class VerificationTokenProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
                                          conf: Configuration,
                                          lifecycle: ApplicationLifecycle,
                                          system: ActorSystem)(implicit ec: ExecutionContext, up: UserProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger        = LoggerFactory.getLogger(this.getClass)
  private final val configuration = conf.get[VerificationTokenConfiguration]("application.auth.verification")

  import dbConfig.profile.api._

  private final val tokens = TableQuery[VerificationTokenTable]

  private final val expiredTokensDeleteScheduler: Option[Cancellable] = Option(configuration.interval.getSeconds != 0).collect {
    case true =>
      system.scheduler.schedule(configuration.interval.getSeconds seconds, configuration.interval.getSeconds seconds) {
        expired().map(delete) onComplete {
          case Failure(exception) => logger.warn("Cannot delete expired verification tokens", exception)
          case _                  =>
        }
      }
  }

  lifecycle.addStopHook { () =>
    Future.successful(expiredTokensDeleteScheduler.foreach(_.cancel()))
  }

  def table: TableQuery[VerificationTokenTable] = tokens

  def all: Future[Seq[VerificationToken]] = db.run(tokens.result)

  def get(token: UUID): Future[Option[VerificationToken]] = db.run(tokens.filter(_.token === token).result.headOption)

  def get(token: Future[UUID]): Future[Option[VerificationToken]] = token.flatMap(get)

  def findForUser(userID: UUID): Future[Option[VerificationToken]] = db.run(tokens.filter(_.userID === userID).result.headOption)

  def findForUser(userID: Future[UUID]): Future[Option[VerificationToken]] = userID.flatMap(findForUser)

  def getWithUser(token: UUID): Future[Option[(VerificationToken, User)]] = db.run(tokens.withUser.filter(_._1.token === token).result.headOption)

  def getWithUser(token: Future[UUID]): Future[Option[(VerificationToken, User)]] = token.flatMap(getWithUser)

  def create(userID: UUID): Future[UUID] = {
    val check = for {
      token <- tokens if token.userID === userID
    } yield token

    db.run(check.result.headOption) flatMap {
      case Some(token) => Future.successful(token.token)
      case None =>
        val token = UUID.randomUUID()
        db.run(tokens += VerificationToken(token, userID, TimeUtils.getExpiredAt(configuration.keep))) map {
          case 1 => token
          case _ => throw new RuntimeException("Cannot create VerificationToken instance in database: Internal error")
        } onSuccessSideEffect { tokenID =>
          processToken(userID, tokenID)
        }
    }
  }

  def create(userID: Future[UUID]): Future[UUID] = userID.flatMap(create)

  def delete(token: UUID): Future[Int] = db.run(tokens.filter(_.token === token).delete)

  def delete(token: Future[UUID]): Future[Int] = token.flatMap(delete)

  def delete(set: Seq[VerificationToken]): Future[Int] = db.run(tokens.filter(t => t.token inSet set.map(_.token)).delete)

  def expired(date: Timestamp = TimeUtils.getCurrentTimestamp): Future[Seq[VerificationToken]] = db.run(tokens.filter(_.expiredAt < date).result)

  private def processToken(userID: UUID, tokenID: UUID): Unit = {
    configuration.method match {
      case VerificationMethod.EMAIL   => throw new NotImplementedError("Email verification method not implemented")
      case VerificationMethod.CONSOLE => logger.info(s"VerificationToken for user $userID: $tokenID")
      case VerificationMethod.AUTO    => up.verify(tokenID)(this)
      case VerificationMethod.NOOP    =>
    }
  }
}
