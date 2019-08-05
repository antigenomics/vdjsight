package controllers.analysis.dto

import play.api.libs.json.{Json, Reads, Writes}

case class AnalysisClonotypesRequest(page: Long, pageSize: Long)

object AnalysisClonotypesRequest {
  implicit val analysisClonotypesRequestReads: Reads[AnalysisClonotypesRequest] = Json.reads[AnalysisClonotypesRequest]
}

case class AnalysisClonotypesResponse(entries: Seq[String])

object AnalysisClonotypesResponse {
  implicit val analysisClonotypesResponseWrites: Writes[AnalysisClonotypesResponse] = Json.writes[AnalysisClonotypesResponse]
}
