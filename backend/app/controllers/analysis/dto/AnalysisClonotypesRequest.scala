package controllers.analysis.dto

import analysis.clonotypes.CachedClonotypeTablePage
import play.api.libs.json.{Json, Reads, Writes}

case class AnalysisClonotypesRequest(page: Long, pageSize: Long)

object AnalysisClonotypesRequest {
  implicit val analysisClonotypesRequestReads: Reads[AnalysisClonotypesRequest] = Json.reads[AnalysisClonotypesRequest]
}

case class AnalysisClonotypesResponse(page: CachedClonotypeTablePage)

object AnalysisClonotypesResponse {
  implicit val analysisClonotypesResponseWrites: Writes[AnalysisClonotypesResponse] = Json.writes[AnalysisClonotypesResponse]
}
