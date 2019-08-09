package analysis.clonotypes.iocache

import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}
import com.antigenomics.mir.segment.{MissingDiversitySegment, MissingJoiningSegment, MissingVariableSegment}
import utils.binary.BinaryWriter

case class CachedClonotypeTableWriter(writer: BinaryWriter) {

  def write[C <: Clonotype](index: Int, cc: ClonotypeCall[C]): Unit = {

    val count  = cc.getCount
    val freq   = cc.getFrequency
    val cdr3aa = cc.getCdr3Aa.toString
    val cdr3nt = cc.getCdr3Nt.toString
    val bv     = cc.getBestVariableSegment
    val bd     = cc.getBestDiversitySegment
    val bj     = cc.getBestJoiningSegment

    val v = if (bv != MissingVariableSegment.INSTANCE) bv.getId else ""
    val d = if (bd != MissingDiversitySegment.INSTANCE) bd.getId else ""
    val j = if (bj != MissingJoiningSegment.INSTANCE) bj.getId else ""

    val computedSize = 4 + 8 + 8 + (1 + cdr3aa.length) + (1 + cdr3nt.length) + (1 + v.length) + (1 + d.length) + (1 + j.length)

    writer.writeInt(computedSize)
    writer.writeInt(index)
    writer.writeLong(count)
    writer.writeDouble(freq)
    writer.writeSmallString(cdr3aa)
    writer.writeSmallString(cdr3nt)
    writer.writeSmallString(v)
    writer.writeSmallString(d)
    writer.writeSmallString(j)
  }

  def flush(): Unit = writer.flush()

}
