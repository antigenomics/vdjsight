package analysis.clonotypes.cache

import java.io.InputStream

import analysis.clonotypes.LiteClonotypeTableRow
import utils.binary.BinaryReader

case class LiteClonotypeTableReader(input: InputStream) {
  private val reader = BinaryReader(input)

  def next(): LiteClonotypeTableRow = {
    reader.readInt() // skip size
    LiteClonotypeTableRow(
      index  = reader.readInt(),
      freq   = reader.readDouble(),
      cdr3aa = reader.readSmallString(),
      cdr3nt = reader.readSmallString(),
      v      = reader.readSmallString(),
      d      = reader.readSmallString(),
      j      = reader.readSmallString()
    )
  }

  def safeNext(): Option[LiteClonotypeTableRow] = {
    if (reader.available()) Some(next()) else None
  }

  def skip(): Unit = {
    if (reader.available()) {
      val size = reader.readInt()
      reader.skip(size)
    }
  }

  def skip(n: Int): Unit = {
    if (reader.available()) {
      1.to(n).foreach(_ => skip())
    }
  }

  def available(): Boolean = reader.available()

  def close(): Unit = {
    input.close()
  }

}
