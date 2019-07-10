package controllers.samples.dto

import models.sample.SampleFileLinkDTO
import play.api.libs.json.{Json, Writes}

case class SamplesListResponse(samples: Seq[SampleFileLinkDTO])

object SamplesListResponse {
  implicit final val samplesListResponseWrites: Writes[SamplesListResponse] = Json.writes[SamplesListResponse]
}
