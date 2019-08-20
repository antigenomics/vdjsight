package analysis.clonotypes

import java.io.{InputStream, OutputStream}

import analysis.clonotypes.iocache.{CachedClonotypeTableReader, CachedClonotypeTableWriter}
import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}
import utils.CommonUtils
import utils.binary.{BinaryReader, BinaryWriter}

import scala.util.Using.Releasable

case class CachedClonotypeTable(size: Int, private val reader: CachedClonotypeTableReader) {

  def view(
    page: Int,
    pageSize: Int    = CachedClonotypeTable.TABLE_PAGE_SIZE_DEFAULT,
    pagesRegion: Int = CachedClonotypeTable.TABLE_PAGES_REGION_SIZE_DEFAULT
  ): CachedClonotypeTableView = {
    val safePageSize =
      CommonUtils.safeBetween(pageSize, (CachedClonotypeTable.TABLE_PAGE_SIZE_MIN, CachedClonotypeTable.TABLE_PAGE_SIZE_MAX))
    val safePagesRegion =
      CommonUtils.safeBetween(pagesRegion, (CachedClonotypeTable.TABLE_PAGES_REGION_SIZE_MIN, CachedClonotypeTable.TABLE_PAGES_REGION_SIZE_MAX))

    val pages       = this.pages(page, safePageSize, safePagesRegion)
    val pageNumbers = pages.map(_.page)
    val defaultPage = CommonUtils.safeBetween(page, (pageNumbers.min, pageNumbers.max))

    CachedClonotypeTableView((size / safePageSize) + 1, defaultPage, safePageSize, safePagesRegion, pages)
  }

  def pages(
    page: Int,
    pageSize: Int    = CachedClonotypeTable.TABLE_PAGE_SIZE_DEFAULT,
    pagesRegion: Int = CachedClonotypeTable.TABLE_PAGES_REGION_SIZE_DEFAULT
  ): Seq[CachedClonotypeTablePage] = {

    val totalPages: Int = (size / pageSize) + 1

    val range: (Int, Int) = {
      val min = page - pagesRegion
      val max = page + pagesRegion

      if (min < 1) {
        (1, max - min)
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

    val rows = take((safeRange._2 - safeRange._1 + 1) * pageSize)

    (safeRange._1 to safeRange._2).map(p => {
      CachedClonotypeTablePage(p, rows.slice((p - safeRange._1) * pageSize, (p - safeRange._1) * pageSize + pageSize).force)
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
  final val VERSION: Long = 1L

  final val TABLE_PAGE_SIZE_MIN: Int     = 1
  final val TABLE_PAGE_SIZE_MAX: Int     = 50
  final val TABLE_PAGE_SIZE_DEFAULT: Int = 25

  final val TABLE_PAGES_REGION_SIZE_MIN: Int     = 0
  final val TABLE_PAGES_REGION_SIZE_MAX: Int     = 5
  final val TABLE_PAGES_REGION_SIZE_DEFAULT: Int = 5

  implicit val liteClonotypeTableReleasable: Releasable[CachedClonotypeTable] = (resource: CachedClonotypeTable) => resource.close()

  def write[C <: Clonotype](output: OutputStream, clonotypes: java.util.List[ClonotypeCall[C]]): Unit = {
    val binaryOutput = BinaryWriter(output)

    binaryOutput.writeLong(CachedClonotypeTable.VERSION)
    binaryOutput.writeInt(clonotypes.size())

    val clonotypeBinaryWriter = CachedClonotypeTableWriter(binaryOutput)

    var index = 1
    clonotypes.forEach(cc => {
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
