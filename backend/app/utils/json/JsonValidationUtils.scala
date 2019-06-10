package utils.json

import play.api.i18n.Messages
import play.api.libs.json.Reads.pattern
import play.api.libs.json.{JsonValidationError, Reads}

object JsonValidationUtils {

  def validEmail(error: String = "json.validation.email.valid")(implicit messages: Messages): Reads[String] =
    pattern(
      """^[a-zA-Z0-9\.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$""".r,
      error = messages(error)
    )

  def minLength(min: Int, error: String = "json.validation.field.minlength")(implicit messages: Messages): Reads[String] =
    Reads.StringReads.filter(JsonValidationError(messages(error, min)))(_.length >= min)

  def maxLength(max: Int = Int.MaxValue, error: String = "json.validation.field.maxlength")(implicit messages: Messages): Reads[String] =
    Reads.StringReads.filter(JsonValidationError(messages(error, max)))(_.length < max)

}
