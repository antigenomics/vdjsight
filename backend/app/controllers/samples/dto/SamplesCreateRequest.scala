package controllers.samples.dto

import models.sample.SampleFileLinkDTO
import play.api.data.Form
import play.api.data.Forms.{longNumber, mapping, nonEmptyText}
import play.api.libs.json.{Json, Writes}

case class SamplesCreateRequest(name: String, extension: String, size: Long, software: String, species: String, gene: String, hash: String)

object SamplesCreateRequest {
  implicit val samplesUploadRequestMapping: Form[SamplesCreateRequest] = Form(
    mapping(
      "name"      -> nonEmptyText(maxLength = 255),
      "extension" -> nonEmptyText(maxLength = 32),
      "size"      -> longNumber(),
      "software"  -> nonEmptyText(maxLength = 64),
      "species"   -> nonEmptyText(maxLength = 32),
      "gene"      -> nonEmptyText(maxLength = 16),
      "hash"      -> nonEmptyText()
    )(SamplesCreateRequest.apply)(SamplesCreateRequest.unapply) verifying ("sample.file.form.invalid.software", { sampleFileForm =>
      // Software.values().map(_.toString).contains(sampleFileForm.software)
      // TODO Software check
      true
    })
  )
}

case class SamplesCreateResponse(link: SampleFileLinkDTO)

object SamplesCreateResponse {
  implicit val samplesCreateResponseWrites: Writes[SamplesCreateResponse] = Json.writes[SamplesCreateResponse]
}
