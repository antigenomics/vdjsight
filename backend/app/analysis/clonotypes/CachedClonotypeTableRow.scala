package analysis.clonotypes

import play.api.libs.json.{Json, Writes}

case class CachedClonotypeTableRowMarkup(vend: Int, dstart: Int, dend: Int, jstart: Int)

case class CachedClonotypeTableRow(
  index: Int,
  count: Long,
  freq: Double,
  cdr3aa: String,
  cdr3nt: String,
  v: String,
  d: String,
  j: String,
  markup: CachedClonotypeTableRowMarkup
)

object CachedClonotypeTableRow {
  implicit val clonotypesTableRowMarkupWrites: Writes[CachedClonotypeTableRowMarkup] = Json.writes[CachedClonotypeTableRowMarkup]
  implicit val clonotypesTableRowWrites: Writes[CachedClonotypeTableRow]             = Json.writes[CachedClonotypeTableRow]
}
