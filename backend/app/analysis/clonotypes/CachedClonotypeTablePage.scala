package analysis.clonotypes

import play.api.libs.json.{Json, Writes}

case class CachedClonotypeTablePage(
  page: Long,
  pageSize: Long,
  rows: Seq[CachedClonotypeTableRow]
)

object CachedClonotypeTablePage {
  implicit val clonotypesTablePageWrites: Writes[CachedClonotypeTablePage] = Json.writes[CachedClonotypeTablePage]
}
