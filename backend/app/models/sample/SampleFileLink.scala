package models.sample

import java.util.UUID

import com.google.inject.{Inject, Singleton}
import models.project.ProjectProvider
import org.slf4j.LoggerFactory
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

case class SampleFileLink(uuid: UUID, sampleID: UUID, projectID: UUID)

class SampleFileLinkTable(tag: Tag)(implicit sfp: SampleFileProvider, pp: ProjectProvider) extends Table[SampleFileLink](tag, SampleFileLinkTable.TABLE_NAME) {
  def uuid      = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def sampleID  = column[UUID]("sample_id", O.SqlType("uuid"))
  def projectID = column[UUID]("project_id", O.SqlType("uuid"))

  def * = (uuid, sampleID, projectID) <> (SampleFileLink.tupled, SampleFileLink.unapply)

  def sample = foreignKey("sample_file_link_table_sample_fk", sampleID, sfp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def project = foreignKey("sample_file_link_table_project_fk", projectID, pp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def sample_id_idx  = index("sample_file_link_table_sample_id_idx", sampleID, unique   = false)
  def project_id_idx = index("sample_file_link_table_project_id_idx", projectID, unique = false)
}

object SampleFileLinkTable {
  final val TABLE_NAME = "sample_file_link"
}

@Singleton
class SampleFileLinkProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(
  implicit sfp: SampleFileProvider,
  pp: ProjectProvider
) extends HasDatabaseConfigProvider[JdbcProfile] {

  private final val logger = LoggerFactory.getLogger(this.getClass)

  import dbConfig.profile.api._

  private final val links = TableQuery[SampleFileLinkTable]

  def table: TableQuery[SampleFileLinkTable] = links

}
