package server

import play.api.http.{ContentTypeOf, ContentTypes, Writeable}
import play.api.libs.json.{Json, Reads, Writes}
import play.api.mvc.Codec

case class ServerResponse[T](data: T)

object ServerResponse {
  implicit def serverResponseWrites[T](implicit fmt: Writes[T]): Writes[ServerResponse[T]] = Json.writes[ServerResponse[T]]
  implicit def serverResponseReads[T](implicit fmt: Reads[T]): Reads[ServerResponse[T]] = Json.reads[ServerResponse[T]]

  implicit def serverResponseWritable[T](implicit fmt: Writes[ServerResponse[T]], codec: Codec): Writeable[ServerResponse[T]] = {
    implicit val ct: ContentTypeOf[ServerResponse[T]] = ContentTypeOf[ServerResponse[T]](Some(ContentTypes.JSON))
    Writeable(Writeable.writeableOf_JsValue.transform compose fmt.writes)
  }

  final val EMPTY = ServerResponse("null")
}

case class ServerResponseError(error: String, extra: Option[List[String]] = None)

object ServerResponseError {
  implicit def serverResponseErrorWrites: Writes[ServerResponseError] = Json.writes[ServerResponseError]
  implicit def serverResponseErrorReads: Reads[ServerResponseError] = Json.reads[ServerResponseError]

  implicit def serverResponseErrorWritable(implicit fmt: Writes[ServerResponseError], codec: Codec): Writeable[ServerResponseError] = {
    implicit val ct: ContentTypeOf[ServerResponseError] = ContentTypeOf[ServerResponseError](Some(ContentTypes.JSON))
    Writeable(Writeable.writeableOf_JsValue.transform compose fmt.writes)
  }
}
