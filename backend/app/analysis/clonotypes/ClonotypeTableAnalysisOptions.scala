package analysis.clonotypes

import play.api.libs.json.{Json, Reads}

case class ClonotypeTableAnalysisOptions(
  pageSize: Int,
  pagesRegion: Int,
  sort: String,
  vFilters: Seq[String],
  dFilters: Seq[String],
  jFilters: Seq[String]
)

object ClonotypeTableAnalysisOptions {
  implicit val clonotypeTableAnalysisOptionsReads: Reads[ClonotypeTableAnalysisOptions] = Json.reads[ClonotypeTableAnalysisOptions]
}
