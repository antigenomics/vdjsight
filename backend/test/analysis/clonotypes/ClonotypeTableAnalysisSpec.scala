package analysis.clonotypes

import java.io.{BufferedInputStream, BufferedOutputStream, ByteArrayInputStream, ByteArrayOutputStream}

import analysis.AnalysisTestTag
import com.antigenomics.mir.clonotype.ClonotypeCall
import com.antigenomics.mir.clonotype.io.ClonotypeTablePipe
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.rearrangement.ReadlessClonotypeImpl
import com.antigenomics.mir.segment.{Gene, MissingDiversitySegment, MissingJoiningSegment, MissingVariableSegment}
import com.antigenomics.mir.{CommonUtils, Species}
import org.scalatest.{Assertion, Assertions}
import specs.BaseTestSpec
import utils.StreamUtils

class ClonotypeTableAnalysisSpec extends BaseTestSpec {

  "ClonotypeTableAnalysis" should {

    "be able to create and verify cache for clonotype table" taggedAs AnalysisTestTag in {

      def checkEquality(index: Int, cc: ClonotypeCall[ReadlessClonotypeImpl], r: CachedClonotypeTableRow): Assertion = {
        val bv = cc.getBestVariableSegment
        val bd = cc.getBestDiversitySegment
        val bj = cc.getBestJoiningSegment

        r.index shouldEqual (index + 1)
        r.count shouldEqual cc.getCount
        r.freq shouldEqual cc.getFrequency
        r.cdr3aa shouldEqual cc.getCdr3Aa.toString
        r.cdr3nt shouldEqual cc.getCdr3Nt.toString
        r.v shouldEqual (if (bv != MissingVariableSegment.INSTANCE) bv.getId else "")
        r.d shouldEqual (if (bd != MissingDiversitySegment.INSTANCE) bd.getId else "")
        r.j shouldEqual (if (bj != MissingJoiningSegment.INSTANCE) bj.getId else "")
        r.markup.vend shouldEqual cc.getClonotype.getJunctionMarkup.getVEnd
        r.markup.dstart shouldEqual cc.getClonotype.getJunctionMarkup.getDStart
        r.markup.dend shouldEqual cc.getClonotype.getJunctionMarkup.getDEnd
        r.markup.jstart shouldEqual cc.getClonotype.getJunctionMarkup.getJStart
      }

      val clonotypesStream = ClonotypeTableParserUtils
        .streamFrom(
          CommonUtils.getFileAsStream(getClass.getResource("/vdjtools.txt").getPath, false),
          Software.VDJtools,
          Species.Human,
          Gene.TRB
        )
        .asInstanceOf[ClonotypeTablePipe[ReadlessClonotypeImpl]]

      val stream = StreamUtils.makeLazyList(new StreamUtils.StreamLike[ClonotypeCall[ReadlessClonotypeImpl]] {
        override def hasNext: Boolean                           = clonotypesStream.hasNext
        override def next: ClonotypeCall[ReadlessClonotypeImpl] = clonotypesStream.next()
      })

      val bytes  = new ByteArrayOutputStream(10485760)
      val output = new BufferedOutputStream(bytes, 4096)

      val size = CachedClonotypeTable.write(output, stream)

      val input1  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 4096)
      val cached1 = CachedClonotypeTable.read(size, input1)
      var index1  = 0
      cached1
        .rows()
        .foreach(r => {
          checkEquality(index1, stream.toSeq(index1), r)
          index1 += 1
        })

      val input2  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 16)
      val cached2 = CachedClonotypeTable.read(size, input2)
      var index2  = 100
      cached2
        .skip(100)
        .foreach(r => {
          checkEquality(index2, stream.toSeq(index2), r)
          index2 += 1
        })

      val input3  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 65536)
      val cached3 = CachedClonotypeTable.read(size, input3)
      var index3  = 900
      cached3
        .skip(900)
        .take(10000)
        .foreach(r => {
          checkEquality(index3, stream.toSeq(index3), r)
          index3 += 1
        })

      Assertions.succeed
    }

  }

}
