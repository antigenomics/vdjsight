package analysis.clonotypes.iocache

import analysis.clonotypes.CachedClonotypeTableRow
import utils.binary.BinaryReader

case class CachedClonotypeTableReader(reader: BinaryReader) {

  def next(): CachedClonotypeTableRow = {
    reader.readInt() // skip size
    CachedClonotypeTableRow(
      index  = reader.readInt(),
      count  = reader.readLong(),
      freq   = reader.readDouble(),
      cdr3aa = reader.readSmallString(),
      cdr3nt = reader.readSmallString(),
      v      = reader.readSmallString(),
      d      = reader.readSmallString(),
      j      = reader.readSmallString()
    )
  }

  def safeNext(): Option[CachedClonotypeTableRow] = {
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

  def close(): Unit = reader.close()

}
