package models.user

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import effects.{AbstractEffectEvent, EffectsEventsStream}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.{ConfigLoader, Configuration, Logging}
import play.db.NamedDatabase
import server.{BadRequestException, InternalServerErrorException}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

import scala.concurrent.{ExecutionContext, Future}
import scala.language.{higherKinds, implicitConversions, postfixOps}

case class UserPermissionsConfiguration(
  maxProjectsCount: Long,
  maxSamplesCount: Long,
  maxSampleSize: Long,
  maxDanglingProjectLinks: Long,
  maxDanglingSampleLinks: Long
)

object UserPermissionsConfiguration {
  implicit val userPermissionsDefaultConfigurationLoader: ConfigLoader[UserPermissionsConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    UserPermissionsConfiguration(
      maxProjectsCount        = config.getLong("maxProjectsCount"),
      maxSamplesCount         = config.getLong("maxSamplesCount"),
      maxSampleSize           = config.getMemorySize("maxSampleSize").toBytes,
      maxDanglingProjectLinks = config.getLong("maxDanglingProjectLinks"),
      maxDanglingSampleLinks  = config.getLong("maxDanglingSampleLinks")
    )
  }
}

case class UserPermissions(
  uuid: UUID,
  userID: UUID,
  maxProjectsCount: Long,
  maxSamplesCount: Long,
  maxSampleSize: Long,
  maxDanglingProjectLinks: Long,
  maxDanglingSampleLinks: Long
)

class UserPermissionsTable(tag: Tag)(implicit up: UserProvider) extends Table[UserPermissions](tag, UserPermissionsTable.TABLE_NAME) {
  def uuid                    = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def userID                  = column[UUID]("user_id", O.Unique, O.SqlType("uuid"))
  def maxProjectsCount        = column[Long]("max_projects_count")
  def maxSamplesCount         = column[Long]("max_samples_count")
  def maxSampleSize           = column[Long]("max_sample_size")
  def maxDanglingProjectLinks = column[Long]("max_dangling_project_links")
  def maxDanglingSampleLinks  = column[Long]("max_dangling_sample_links")

  def * =
    (
      uuid,
      userID,
      maxProjectsCount,
      maxSamplesCount,
      maxSampleSize,
      maxDanglingProjectLinks,
      maxDanglingSampleLinks
    ) <> (UserPermissions.tupled, UserPermissions.unapply)

  def user = foreignKey("user_permissions_table_user_fk", userID, up.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
  )

  def user_id_idx = index("user_permissions_table_user_id_idx", userID, unique = true)
}

object UserPermissionsTable {
  final val TABLE_NAME = "user_permissions"

  implicit class UserPermissionsTableExtension[C[_]](q: Query[UserPermissionsTable, UserPermissions, C]) {

    def withUser(implicit up: UserProvider): Query[(UserPermissionsTable, UserTable), (UserPermissions, User), C] = {
      q.join(up.table).on(_.userID === _.uuid)
    }

  }
}

trait UserPermissionsProviderEvent extends AbstractEffectEvent

object UserPermissionsProviderEvents {
  case class UserPermissionsCreated(permissions: UserPermissions) extends UserPermissionsProviderEvent
}

@Singleton
class UserPermissionsProvider @Inject()(
  @NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider,
  conf: Configuration,
  events: EffectsEventsStream
)(
  implicit
  ec: ExecutionContext,
  up: UserProvider
) extends HasDatabaseConfigProvider[JdbcProfile]
    with Logging {

  final private val configuration = conf.get[UserPermissionsConfiguration]("application.users.permissions")

  import dbConfig.profile.api._

  final private val permissions = TableQuery[UserPermissionsTable]

  def table: TableQuery[UserPermissionsTable] = permissions

  def all: Future[Seq[UserPermissions]] = db.run(permissions.result)

  def get(uuid: UUID): Future[Option[UserPermissions]] = db.run(permissions.filter(_.uuid === uuid).result.headOption)

  def findForUser(userID: UUID): Future[Option[UserPermissions]] = db.run(permissions.filter(_.userID === userID).result.headOption)

  def getWithUser(uuid: UUID): Future[Option[(UserPermissions, User)]] = db.run(permissions.withUser.filter(_._1.uuid === uuid).result.headOption)

  def create(userID: UUID, overrideConfiguration: Option[UserPermissionsConfiguration] = None): Future[UserPermissions] = {
    val actions = up.table.filter(_.uuid === userID).result.headOption flatMap {
        case Some(_) =>
          permissions.filter(_.userID === userID).result.headOption flatMap {
            case Some(permission) => DBIO.successful(permission)
            case None =>
              val uuid = UUID.randomUUID()
              val conf = overrideConfiguration.getOrElse(configuration)
              val permission = UserPermissions(
                uuid                    = uuid,
                userID                  = userID,
                maxProjectsCount        = conf.maxProjectsCount,
                maxSamplesCount         = conf.maxSamplesCount,
                maxSampleSize           = conf.maxSampleSize,
                maxDanglingProjectLinks = conf.maxDanglingProjectLinks,
                maxDanglingSampleLinks  = conf.maxDanglingSampleLinks
              )
              (permissions += permission) flatMap {
                case 1 =>
                  events.publish(UserPermissionsProviderEvents.UserPermissionsCreated(permission))
                  DBIO.successful(permission)
                case _ => DBIO.failed(InternalServerErrorException("Cannot create UserPermissions instance in database: Database error"))
              }
          }
        case None => DBIO.failed(BadRequestException("Cannot create UserPermissions instance in database: User does not exist"))
      }

    db.run(actions.transactionally)
  }

}
