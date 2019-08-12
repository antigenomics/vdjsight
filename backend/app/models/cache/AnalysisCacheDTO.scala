package models.cache

import java.sql.Timestamp
import java.util.{Date, UUID}

import models.sample.{SampleFile, SampleFileLink}
import play.api.libs.json.{Json, Writes}

case class AnalysisCacheDTO(
  uuid: UUID,
  sampleFileLinkUUID: UUID,
  analysis: String,
  marker: String,
  expiredAt: Timestamp
)

object AnalysisCacheDTO {
  implicit val timestampWriter: Writes[Timestamp]               = (t: Timestamp) => Json.toJson(new Date(t.getTime))
  implicit val analysisCacheDTOWrites: Writes[AnalysisCacheDTO] = Json.writes[AnalysisCacheDTO]

  def from(link: SampleFileLink, sample: SampleFile, cache: AnalysisCache): AnalysisCacheDTO = {
    if (link.sampleID != sample.uuid) {
      throw new RuntimeException("Invalid AnalysisCacheDTO arguments")
    }
    AnalysisCacheDTO(
      uuid               = cache.uuid,
      sampleFileLinkUUID = link.uuid,
      analysis           = cache.analysisType,
      marker             = cache.marker,
      expiredAt          = cache.expiredAt
    )
  }
}
