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

      writer.write(1)
      writer.write(-2)
      writer.write(Int.MaxValue)
      writer.write(2.0)
      writer.write(Double.MaxValue)
      writer.write(Double.MinPositiveValue)
      writer.write("Hello")
      writer.write("world!")
      writer.write(0.0)
      writer.write(0)

      writer.write(0)
      writer.write(0)
      writer.write(0)
      writer.write(1)

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
