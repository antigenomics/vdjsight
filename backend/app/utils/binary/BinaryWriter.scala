package utils.binary

import java.io.OutputStream
import java.nio.ByteBuffer

case class BinaryWriter(private val stream: OutputStream, private val capacity: Int = BinaryWriter.BUFFER_CAPACITY) {
  private val buffer: ByteBuffer = ByteBuffer.allocate(capacity)

  def writeByte(value: Byte): Unit = {
    if (buffer.remaining() < 1) {
      flush()
    }
    buffer.put(value)
  }

  def writeChar(value: Char): Unit = {
    if (buffer.remaining() < 2) {
      flush()
    }
    buffer.putChar(value)
  }

  def writeInt(value: Int): Unit = {
    if (buffer.remaining() < 4) {
      flush()
    }
    buffer.putInt(value)
  }

  def writeDouble(value: Double): Unit = {
    if (buffer.remaining() < 8) {
      flush()
    }
    buffer.putDouble(value)
  }

  def writeString(string: String): Unit = {
    if (buffer.remaining() < (4 + string.length)) {
      flush()
    }
    buffer.putInt(string.length)
    buffer.put(string.getBytes)
  }

  def writeSmallString(string: String): Unit = {
    if (buffer.remaining() < (1 + string.length)) {
      flush()
    }
    if (string.length > 256) {
      throw new RuntimeException("BinaryUtils: String is not small")
    }
    buffer.put(string.length.toByte)
    buffer.put(string.getBytes)
  }

  def writeBytes(bytes: Array[Byte]): Unit = {
    if (buffer.remaining() < (4 + bytes.length)) {
      flush()
    }
    buffer.putInt(bytes.length)
    buffer.put(bytes)
  }

  def close(): Unit = {
    flush()
    stream.close()
  }

  def flush(): Unit = {
    if (buffer.position() != 0) {
      stream.write(buffer.array(), 0, buffer.position())
      stream.flush()
      buffer.clear()
    }
  }
}

object BinaryWriter {
  final private val BUFFER_CAPACITY: Int = 262144
}
