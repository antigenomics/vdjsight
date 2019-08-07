package utils.binary

import java.io.{ByteArrayInputStream, ByteArrayOutputStream}

import specs.BaseTestSpec
import utils.UtilsTestTag

class BinaryUtilsSpec extends BaseTestSpec {

  "BinaryUtils" should {

    "be able to write and read binary data to/from stream" taggedAs UtilsTestTag in {

      val output = new ByteArrayOutputStream(65536)
      output.reset()

      val writer = BinaryWriter(output)

      writer.writeInt(1)
      writer.writeInt(-2)
      writer.writeInt(Int.MaxValue)
      writer.writeDouble(2.0)
      writer.writeDouble(Double.MaxValue)
      writer.writeDouble(Double.MinPositiveValue)
      writer.writeString("Hello")
      writer.writeString("world!")
      writer.writeDouble(0.0)
      writer.writeInt(0)

      writer.writeInt(0)
      writer.writeInt(0)
      writer.writeInt(0)
      writer.writeInt(1)

      writer.flush()

      val input = new ByteArrayInputStream(output.toByteArray)

      val reader = BinaryReader(input)

      reader.readInt() shouldEqual 1
      reader.readInt() shouldEqual -2
      reader.readInt() shouldEqual Int.MaxValue
      reader.readDouble() shouldEqual 2.0
      reader.readDouble() shouldEqual Double.MaxValue
      reader.readDouble() shouldEqual Double.MinPositiveValue
      reader.readString() shouldEqual "Hello"
      reader.readString() shouldEqual "world!"
      reader.readDouble() shouldEqual 0.0
      reader.readInt() shouldEqual 0

      reader.skip(12)
      reader.readInt() shouldEqual 1
    }

  }

}
