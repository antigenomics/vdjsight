package models.sample

import java.util.UUID

import javax.inject.{Inject, Singleton}
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.PostgresProfile.api._
import slick.jdbc.JdbcProfile
import slick.lifted.Tag

case class SampleFileLink(uuid: UUID, sampleID: UUID)

class SampleFileLinkTable(tag: Tag)(implicit sfp: SampleFileProvider) extends Table[SampleFileLink](tag, SampleFileLinkTable.TABLE_NAME) {
  def uuid     = column[UUID]("UUID", O.PrimaryKey, O.SqlType("UUID"))
  def sampleID = column[UUID]("SAMPLE_ID", O.SqlType("UUID"))

  def * = (uuid, sampleID) <> (SampleFileLink.tupled, SampleFileLink.unapply)

  def sample = foreignKey("SAMPLE_FILE_LINK_TABLE_SAMPLE_FK", sampleID, sfp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def sampleID_idx = index("SAMPLE_FILE_LINK_TABLE_SAMPLE_ID_IDX", sampleID, unique = false)
}

object SampleFileLinkTable {
  final val TABLE_NAME = "SAMPLE_FILE_LINK"
}

@Singleton
class SampleFileLinkProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(implicit sfp: SampleFileProvider)
    extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val links = TableQuery[SampleFileLinkTable]

  def table: TableQuery[SampleFileLinkTable] = links

}
