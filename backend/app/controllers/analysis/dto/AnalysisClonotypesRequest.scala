package controllers.analysis.dto

import analysis.clonotypes.LiteClonotypeTablePage
import play.api.libs.json.{Json, Reads, Writes}

case class AnalysisClonotypesRequest(page: Long, pageSize: Long)

object AnalysisClonotypesRequest {
  implicit val analysisClonotypesRequestReads: Reads[AnalysisClonotypesRequest] = Json.reads[AnalysisClonotypesRequest]
}

case class AnalysisClonotypesResponse(page: LiteClonotypeTablePage)

object AnalysisClonotypesResponse {
  implicit val analysisClonotypesResponseWrites: Writes[AnalysisClonotypesResponse] = Json.writes[AnalysisClonotypesResponse]
}
