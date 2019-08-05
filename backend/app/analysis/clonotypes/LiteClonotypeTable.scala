package analysis.clonotypes

import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}

import scala.jdk.CollectionConverters._

case class LiteClonotypeTable(rows: scala.collection.Seq[LiteClonotypeTableRow]) {}

object LiteClonotypeTable {

  def from[C <: Clonotype](table: ClonotypeTable[ClonotypeCall[C]]): LiteClonotypeTable = {
    val rows = table.getClonotypes.asScala.zipWithIndex.map {
      case (cc, index) =>
        LiteClonotypeTableRow(
          index       = index,
          frequency   = 0.0,
          cdr3aa      = cc.getCdr3Aa.toString,
          cdr3nt      = cc.getCdr3Nt.toString,
          v           = cc.getVariableSegmentCalls.asScala.headOption.map(_.toString),
          d           = cc.getDiversitySegmentCalls.asScala.headOption.map(_.toString),
          j           = cc.getJoiningSegmentCalls.asScala.headOption.map(_.toString),
          annotations = cc.getAnnotations.asScala.toSeq.toMap
        )
    }
    LiteClonotypeTable(rows)
  }
}
