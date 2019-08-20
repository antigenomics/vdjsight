package analysis.clonotypes

import play.api.libs.json.{Json, Reads}

case class ClonotypeTableAnalysisOptions(sort: String)

object ClonotypeTableAnalysisOptions {
  implicit val clonotypeTableAnalysisOptionsReads: Reads[ClonotypeTableAnalysisOptions] = Json.reads[ClonotypeTableAnalysisOptions]
}
