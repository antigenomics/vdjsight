package utils.binary

import java.io.InputStream
import java.nio.ByteBuffer

case class BinaryReader(private val stream: InputStream) {

  def readInt(): Int = {
    ByteBuffer.wrap(stream.readNBytes(4)).getInt
  }

  def readDouble(): Double = {
    ByteBuffer.wrap(stream.readNBytes(8)).getDouble
  }

  def readString(): String = {
    val length = ByteBuffer.wrap(stream.readNBytes(4)).getInt
    stream.readNBytes(length).map(_.toChar).mkString
  }

  def readBytes(): Array[Byte] = {
    val length = ByteBuffer.wrap(stream.readNBytes(4)).getInt
    stream.readNBytes(length)
  }

  def skip(n: Int): Unit = {
    stream.skip(n.toLong)
  }

  def available(): Boolean = {
    stream.available() != 0
  }

}
