package controllers.samples.dto

import java.util.UUID

import models.sample.SampleFileLinkDTO
import play.api.libs.json.{Json, JsonValidationError, Reads, Writes}

case class SamplesUpdateRequest(uuid: UUID, name: String, software: String, species: String, gene: String)

object SamplesUpdateRequest {
  implicit val samplesUpdateRequestReads: Reads[SamplesUpdateRequest] =
    Json.reads[SamplesUpdateRequest].filter(JsonValidationError("Empty name is not allowed"))(r => !r.name.isEmpty)
}

case class SamplesUpdateResponse(link: SampleFileLinkDTO)

object SamplesUpdateResponse {
  implicit val samplesUpdateResponseWrites: Writes[SamplesUpdateResponse] = Json.writes[SamplesUpdateResponse]
}
