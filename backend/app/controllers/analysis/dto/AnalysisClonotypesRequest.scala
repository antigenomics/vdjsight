package controllers.analysis.dto

import analysis.clonotypes.{CachedClonotypeTableView, ClonotypeTableAnalysisOptions}
import play.api.libs.json.{Json, Reads, Writes}

case class AnalysisClonotypesRequest(page: Int, pageSize: Int, pagesRegion: Int, marker: String, options: ClonotypeTableAnalysisOptions)

object AnalysisClonotypesRequest {
  implicit val analysisClonotypesRequestReads: Reads[AnalysisClonotypesRequest] = Json.reads[AnalysisClonotypesRequest]
}

case class AnalysisClonotypesResponse(view: CachedClonotypeTableView)

object AnalysisClonotypesResponse {
  implicit val analysisClonotypesResponseWrites: Writes[AnalysisClonotypesResponse] = Json.writes[AnalysisClonotypesResponse]
}
