package utils

import java.util.UUID

import scala.language.implicitConversions

object UUIDUtils {
  implicit def stringToUUID(arg: String): UUID = UUID.fromString(arg)
}
