package analysis.clonotypes.iocache

import com.antigenomics.mir.clonotype.ClonotypeCall
import com.antigenomics.mir.clonotype.rearrangement.ReadlessClonotypeImpl
import com.antigenomics.mir.segment.{MissingDiversitySegment, MissingJoiningSegment, MissingVariableSegment}
import utils.binary.BinaryWriter

case class CachedClonotypeTableWriter(writer: BinaryWriter) {

  def write(index: Int, c: ClonotypeCall[ReadlessClonotypeImpl]): Unit = {

    val count  = c.getCount
    val freq   = c.getFrequency
    val cdr3aa = c.getCdr3Aa.toString
    val cdr3nt = c.getCdr3Nt.toString
    val bv     = c.getBestVariableSegment
    val bd     = c.getBestDiversitySegment
    val bj     = c.getBestJoiningSegment

    val v = if (bv != MissingVariableSegment.INSTANCE) bv.getId else ""
    val d = if (bd != MissingDiversitySegment.INSTANCE) bd.getId else ""
    val j = if (bj != MissingJoiningSegment.INSTANCE) bj.getId else ""

    val computedSize = 4 + 8 + 8 + (1 + cdr3aa.length) + (1 + cdr3nt.length) + (1 + v.length) + (1 + d.length) + (1 + j.length) + 4

    writer.writeInt(computedSize)
    writer.writeInt(index)
    writer.writeLong(count)
    writer.writeDouble(freq)
    writer.writeSmallString(cdr3aa)
    writer.writeSmallString(cdr3nt)
    writer.writeSmallString(v)
    writer.writeSmallString(d)
    writer.writeSmallString(j)
    writer.writeByte(c.getClonotype.getJunctionMarkup.getVEnd.toByte)
    writer.writeByte(c.getClonotype.getJunctionMarkup.getDStart.toByte)
    writer.writeByte(c.getClonotype.getJunctionMarkup.getDEnd.toByte)
    writer.writeByte(c.getClonotype.getJunctionMarkup.getJStart.toByte)
  }

  def flush(): Unit = writer.flush()

}
