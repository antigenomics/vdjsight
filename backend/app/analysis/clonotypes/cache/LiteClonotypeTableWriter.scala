package analysis.clonotypes.cache

import java.io.OutputStream

import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}
import com.antigenomics.mir.segment.{MissingDiversitySegment, MissingJoiningSegment, MissingVariableSegment}
import utils.binary.BinaryWriter

case class LiteClonotypeTableWriter(output: OutputStream) {
  private val writer = BinaryWriter(output)

  def write[C <: Clonotype](index: Int, cc: ClonotypeCall[C]): Unit = {
    // println(index)


    val cdr3aa = cc.getCdr3Aa.toString
    val cdr3nt = cc.getCdr3Nt.toString
    val bv     = cc.getBestVariableSegment
    val bd     = cc.getBestDiversitySegment
    val bj     = cc.getBestJoiningSegment

    val v = if (bv != MissingVariableSegment.INSTANCE) bv.getId else ""
    val d = if (bd != MissingDiversitySegment.INSTANCE) bd.getId else ""
    val j = if (bj != MissingJoiningSegment.INSTANCE) bj.getId else ""

    val computedSize = 4 + 8 + (1 + cdr3aa.length) + (1 + cdr3nt.length) + (1 + v.length) + (1 + d.length) + (1 + j.length)

    writer.writeInt(computedSize)
    writer.writeInt(index)
    writer.writeDouble(0.0) // Freq: todo
    writer.writeSmallString(cdr3aa)
    writer.writeSmallString(cdr3nt)
    writer.writeSmallString(v)
    writer.writeSmallString(d)
    writer.writeSmallString(j)
  }

  def close(): Unit = {
    writer.close()
  }

  def end(): Unit = {
    writer.flush()
  }

}
