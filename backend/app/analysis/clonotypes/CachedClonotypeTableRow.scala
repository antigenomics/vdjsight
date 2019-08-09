package analysis.clonotypes

import play.api.libs.json.{Json, Writes}

case class CachedClonotypeTableRow(
  index: Int,
  count: Long,
  freq: Double,
  cdr3aa: String,
  cdr3nt: String,
  v: String,
  d: String,
  j: String
)

object CachedClonotypeTableRow {
  implicit val clonotypesTableRowWrites: Writes[CachedClonotypeTableRow] = Json.writes[CachedClonotypeTableRow]
}
