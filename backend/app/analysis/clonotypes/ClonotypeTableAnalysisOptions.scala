package analysis.clonotypes

import play.api.libs.json.{Json, Reads}

case class ClonotypeTableAnalysisOptions(pageSize: Int, pagesRegion: Int, sort: String)

object ClonotypeTableAnalysisOptions {
  implicit val clonotypeTableAnalysisOptionsReads: Reads[ClonotypeTableAnalysisOptions] = Json.reads[ClonotypeTableAnalysisOptions]
}
