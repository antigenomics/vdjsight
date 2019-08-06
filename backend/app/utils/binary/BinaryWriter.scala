package utils.binary

import java.io.OutputStream
import java.nio.ByteBuffer

case class BinaryWriter(private val stream: OutputStream, private val capacity: Int = BinaryWriter.BUFFER_CAPACITY) {
  private val buffer: ByteBuffer = ByteBuffer.allocate(capacity)

  def write(value: Int): Unit = {
    if (buffer.remaining() < 4) {
      flush()
    }
    buffer.putInt(value)
  }

  def write(value: Double): Unit = {
    if (buffer.remaining() < 8) {
      flush()
    }
    buffer.putDouble(value)
  }

  def write(string: String): Unit = {
    if (buffer.remaining() < (4 + string.length)) {
      flush()
    }
    buffer.putInt(string.length)
    buffer.put(string.getBytes)
  }

  def write(bytes: Array[Byte]): Unit = {
    if (buffer.remaining() < (5 + bytes.length)) {
      flush()
    }
    buffer.putInt(bytes.length)
    buffer.put(bytes)
  }

  def close(): Unit = {
    flush()
    stream.close()
  }

  private def flush(): Unit = {
    stream.write(buffer.array())
    buffer.clear()
  }
}

object BinaryWriter {
  final private val BUFFER_CAPACITY: Int = 262144
}
