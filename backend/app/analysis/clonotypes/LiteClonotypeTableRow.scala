package analysis.clonotypes

import play.api.libs.json.{Json, Writes}

case class LiteClonotypeTableRow(
  index: Int,
  freq: Double,
  cdr3aa: String,
  cdr3nt: String,
  v: String,
  d: String,
  j: String
)

object LiteClonotypeTableRow {
  implicit val clonotypesTableRowWrites: Writes[LiteClonotypeTableRow] = Json.writes[LiteClonotypeTableRow]
}
