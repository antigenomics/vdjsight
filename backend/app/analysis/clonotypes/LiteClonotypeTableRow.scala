package analysis.clonotypes

import play.api.libs.json.{Json, Writes}

case class LiteClonotypeTableRow(
  index: Int,
  frequency: Double,
  cdr3aa: String,
  cdr3nt: String,
  v: Option[String],
  d: Option[String],
  j: Option[String],
  annotations: Map[String, String]
)

object LiteClonotypeTableRow {
  implicit val clonotypesTableRowWrites: Writes[LiteClonotypeTableRow] = Json.writes[LiteClonotypeTableRow]
}
