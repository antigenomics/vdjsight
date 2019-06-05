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

case class VerificationToken(id: Long, token: UUID, userID: UUID, expiredAt: Timestamp)

class VerificationTokenTable(tag: Tag)(implicit up: UserProvider) extends Table[VerificationToken](tag, VerificationTokenTable.TABLE_NAME) {
  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)
  def token = column[UUID]("TOKEN", O.Unique, O.SqlType("UUID"))
  def userID = column[UUID]("USER_ID", O.SqlType("UUID"))
  def expiredAt = column[Timestamp]("EXPIRED_AT")

  def * = (id, token, userID, expiredAt) <> (VerificationToken.tupled, VerificationToken.unapply)

  def user = foreignKey("VERIFICATION_TOKEN_TABLE_USER_FK", userID, up.getTable)(_.uuid,
    onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade
  )

  def token_idx = index("VERIFICATION_TOKEN_TABLE_TOKEN_IDX", token, unique = true)
}

object VerificationTokenTable {
  final val TABLE_NAME = "VERIFICATION_TOKEN"

  implicit class VerificationTokenExtension[C[_]](q: Query[VerificationTokenTable, VerificationToken, C]) {
    def withUser(implicit up: UserProvider): Query[(VerificationTokenTable, UserTable), (VerificationToken, User), C] = {
      q.join(up.getTable).on(_.userID === _.uuid)
    }
  }

}

@Singleton
class VerificationTokenProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit up: UserProvider)
  extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val table = TableQuery[VerificationTokenTable]

  def getTable: TableQuery[VerificationTokenTable] = table
}


