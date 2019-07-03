package models.sample

import java.sql.Timestamp
import java.util.UUID

import com.google.inject.{Inject, Singleton}
import models.project.ProjectProvider
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.db.NamedDatabase
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.lifted.Tag

case class SampleFileLink(uuid: UUID, sampleID: UUID, projectLinkID: UUID, deleteOn: Option[Timestamp])

class SampleFileLinkTable(tag: Tag)(implicit sfp: SampleFileProvider, pp: ProjectProvider) extends Table[SampleFileLink](tag, SampleFileLinkTable.TABLE_NAME) {
  def uuid          = column[UUID]("uuid", O.PrimaryKey, O.SqlType("uuid"))
  def sampleID      = column[UUID]("sample_id", O.SqlType("uuid"))
  def projectLinkID = column[UUID]("project_link_id", O.SqlType("uuid"))
  def deleteOn      = column[Option[Timestamp]]("delete_on")

  def * = (uuid, sampleID, projectLinkID, deleteOn) <> (SampleFileLink.tupled, SampleFileLink.unapply)

  def sample = foreignKey("sample_file_link_table_sample_fk", sampleID, sfp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def project_link = foreignKey("sample_file_link_table_project_link_fk", projectLinkID, pp.table)(
    _.uuid,
    onUpdate = ForeignKeyAction.Cascade,
    onDelete = ForeignKeyAction.Restrict
  )

  def sample_id_idx       = index("sample_file_link_table_sample_id_idx", sampleID, unique       = false)
  def project_link_id_idx = index("sample_file_link_table_project_id_idx", projectLinkID, unique = false)
}

object SampleFileLinkTable {
  final val TABLE_NAME = "sample_file_link"
}

@Singleton
class SampleFileLinkProvider @Inject()(@NamedDatabase("default") protected val dbConfigProvider: DatabaseConfigProvider)(
  implicit sfp: SampleFileProvider,
  pp: ProjectProvider
) extends HasDatabaseConfigProvider[JdbcProfile] {

  import dbConfig.profile.api._

  final private val links = TableQuery[SampleFileLinkTable]

  def table: TableQuery[SampleFileLinkTable] = links

}
