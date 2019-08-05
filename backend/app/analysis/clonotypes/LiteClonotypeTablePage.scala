package analysis.clonotypes

import play.api.libs.json.{Json, Writes}

case class LiteClonotypeTablePage(
  page: Long,
  pageSize: Long,
  rows: Seq[LiteClonotypeTableRow]
)

object LiteClonotypeTablePage {
  implicit val clonotypesTablePageWrites: Writes[LiteClonotypeTablePage] = Json.writes[LiteClonotypeTablePage]
}
