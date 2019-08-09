package analysis.clonotypes

import java.io.{InputStream, OutputStream}

import analysis.clonotypes.iocache.{CachedClonotypeTableReader, CachedClonotypeTableWriter}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}
import utils.binary.{BinaryReader, BinaryWriter}

import scala.util.Using.Releasable

case class CachedClonotypeTable(size: Int, private val reader: CachedClonotypeTableReader) {

  def pages(
    page: Int,
    pageSize: Int = CachedClonotypeTable.TABLE_DEFAULT_PAGE_SIZE,
    region: Int   = CachedClonotypeTable.TABLE_DEFAULT_PAGE_REGION_SIZE
  ): Seq[CachedClonotypeTablePage] = {

    val totalPages: Int = (size / pageSize) + 1

    val range: (Int, Int) = {
      val min = page - region
      val max = page + region

      if (min < 0) {
        (0, max - min)
      } else if (max > totalPages) {
        (min - (max - totalPages), totalPages)
      } else {
        (min, max)
      }
    }

    val safeRange: (Int, Int) = {
      (if (range._1 < 1) 1 else range._1, if (range._2 > totalPages) totalPages else range._2)
    }

    reader.skip((safeRange._1 - 1) * pageSize)

    (safeRange._1 to safeRange._2).map(p => {
      CachedClonotypeTablePage(p, take(pageSize).force)
    })
  }

  def skip(n: Int): LazyList[CachedClonotypeTableRow] = {
    reader.skip(n)
    rows()
  }

  def take(n: Int): LazyList[CachedClonotypeTableRow] = {
    rows().take(n)
  }

  def rows(): LazyList[CachedClonotypeTableRow] = {
    reader.safeNext() match {
      case Some(next) => next #:: rows()
      case None       => LazyList.empty
    }
  }

  def close(): Unit = reader.close()

}

object CachedClonotypeTable {
  final val VERSION: Long                       = 1L
  final val TABLE_DEFAULT_PAGE_SIZE: Int        = 25
  final val TABLE_DEFAULT_PAGE_REGION_SIZE: Int = 5

  implicit val liteClonotypeTableReleasable: Releasable[CachedClonotypeTable] = (resource: CachedClonotypeTable) => resource.close()

  def write[C <: Clonotype](output: OutputStream, table: ClonotypeTable[ClonotypeCall[C]]): Unit = {
    val binaryOutput = BinaryWriter(output)

    binaryOutput.writeLong(CachedClonotypeTable.VERSION)
    binaryOutput.writeInt(table.size())

    val clonotypeBinaryWriter = CachedClonotypeTableWriter(binaryOutput)

    var index = 1
    table
      .stream()
      .forEach(cc => {
        clonotypeBinaryWriter.write(index, cc)
        index += 1
      })

    clonotypeBinaryWriter.flush()
  }

  def read(input: InputStream): CachedClonotypeTable = {
    val binaryInput = BinaryReader(input)

    val version = binaryInput.readLong()
    if (version != CachedClonotypeTable.VERSION) {
      throw new RuntimeException("Invalid cache version")
    } else {
      val size                  = binaryInput.readInt()
      val clonotypeBinaryReader = CachedClonotypeTableReader(binaryInput)
      CachedClonotypeTable(size, clonotypeBinaryReader)
    }

  }
}
