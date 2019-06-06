package models.token

import java.sql.Timestamp
import java.util.UUID

import javax.inject.{Inject, Singleton}
import models.user.{User, UserProvider, UserTable}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.H2Profile.api._
import slick.jdbc.JdbcProfile
import slick.lifted.Tag

import scala.language.higherKinds

case class ResetToken(token: UUID, userID: UUID, expiredAt: Timestamp)

class ResetTokenTable(tag: Tag)(implicit up: UserProvider) extends Table[ResetToken](tag, ResetTokenTable.TABLE_NAME) {
  def token     = column[UUID]("TOKEN", O.PrimaryKey, O.SqlType("UUID"))
  def userID    = column[UUID]("USER_ID", O.SqlType("UUID"))
  def expiredAt = column[Timestamp]("EXPIRED_AT")

  def * = (token, userID, expiredAt) <> (ResetToken.tupled, ResetToken.unapply)

  def user = foreignKey("RESET_TOKEN_TABLE_USER_FK", userID, up.getTable)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Cascade
  )
}

object ResetTokenTable {
  final val TABLE_NAME = "RESET_TOKEN"

  implicit class ResetTokenExtension[C[_]](q: Query[ResetTokenTable, ResetToken, C]) {

    def withUser(implicit up: UserProvider): Query[(ResetTokenTable, UserTable), (ResetToken, User), C] = {
      q.join(up.getTable).on(_.userID === _.uuid)
    }
  }

}

@Singleton
class ResetTokenProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit up: UserProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val table = TableQuery[ResetTokenTable]

  def getTable: TableQuery[ResetTokenTable] = table
}
