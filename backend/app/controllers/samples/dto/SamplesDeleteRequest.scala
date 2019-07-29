package controllers.samples.dto

import java.util.UUID

import play.api.libs.json.{Json, Reads}

case class SamplesDeleteRequest(uuid: UUID, force: Boolean)

object SamplesDeleteRequest {
  implicit val samplesDeleteRequestReads: Reads[SamplesDeleteRequest] = Json.reads[SamplesDeleteRequest]
}
