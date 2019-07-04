package server

case class BadRequestException(message: String) extends Exception(message)

case class InternalServerErrorException(message: String) extends Exception(message)
