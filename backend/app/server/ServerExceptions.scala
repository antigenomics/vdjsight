package server

case class BadRequestException(action: String, message: String) extends Throwable

case class InternalServerErrorException(action: String, message: String) extends Throwable
