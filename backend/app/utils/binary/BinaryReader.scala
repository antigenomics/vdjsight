package utils.binary

import java.io.InputStream
import java.nio.ByteBuffer

case class BinaryReader(private val stream: InputStream) {

  def readByte(): Byte = {
    ByteBuffer.wrap(stream.readNBytes(1)).get
  }

  def readChar(): Char = {
    ByteBuffer.wrap(stream.readNBytes(2)).getChar
  }

  def readInt(): Int = {
    ByteBuffer.wrap(stream.readNBytes(4)).getInt
  }

  def readLong(): Long = {
    ByteBuffer.wrap(stream.readNBytes(8)).getLong
  }

  def readDouble(): Double = {
    ByteBuffer.wrap(stream.readNBytes(8)).getDouble
  }

  def readString(): String = {
    val length = ByteBuffer.wrap(stream.readNBytes(4)).getInt
    stream.readNBytes(length).map(_.toChar).mkString
  }

  def readSmallString(): String = {
    val length = ByteBuffer.wrap(stream.readNBytes(1)).get
    stream.readNBytes(length.toInt).map(_.toChar).mkString
  }

  def readBytes(): Array[Byte] = {
    val length = ByteBuffer.wrap(stream.readNBytes(4)).getInt
    stream.readNBytes(length)
  }

  def readBuffer(size: Int): ByteBuffer = {
    ByteBuffer.wrap(stream.readNBytes(size))
  }

  def skip(n: Int): Unit = {
    var remainingSkip: Long = n.toLong
    while (remainingSkip != 0) {
      val skipped = stream.skip(remainingSkip)
      if (skipped == 0) {
        throw new RuntimeException("Failed to skip bytes in stream")
      }
      remainingSkip = remainingSkip - skipped
    }
  }

  def available(): Boolean = {
    stream.available() != 0
  }

  def close(): Unit = {
    stream.close()
  }

}
