package analysis.clonotypes

import analysis.clonotypes.cache.LiteClonotypeTableReader

import scala.util.Using.Releasable

case class LiteClonotypeTable(private val reader: LiteClonotypeTableReader) {

  def skip(n: Int): LazyList[LiteClonotypeTableRow] = {
    reader.skip(n)
    rows()
  }

  def take(n: Int): LazyList[LiteClonotypeTableRow] = {
    rows().take(n)
  }

  def rows(): LazyList[LiteClonotypeTableRow] = {
    reader.safeNext() match {
      case Some(next) => next #:: rows()
      case None => LazyList.empty
    }
  }

  def close(): Unit = {
    reader.close()
  }

}

object LiteClonotypeTable {
  implicit val liteClonotypeTableReleasable: Releasable[LiteClonotypeTable] = (resource: LiteClonotypeTable) => resource.close()
}
