package analysis.clonotypes

import java.io.{BufferedInputStream, BufferedOutputStream, ByteArrayInputStream, ByteArrayOutputStream}

import analysis.AnalysisTestTag
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}
import com.antigenomics.mir.segment.{Gene, MissingDiversitySegment, MissingJoiningSegment, MissingVariableSegment}
import com.antigenomics.mir.{CommonUtils, Species}
import org.scalatest.{Assertion, Assertions}
import specs.BaseTestSpec

class ClonotypeTableAnalysisSpec extends BaseTestSpec {

  "ClonotypeTableAnalysis" should {

    "be able to create and verify cache for clonotype table" taggedAs AnalysisTestTag in {

      def checkEquality[C <: Clonotype](index: Int, cc: ClonotypeCall[C], r: CachedClonotypeTableRow): Assertion = {
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
      }

      val clonotypesStream = ClonotypeTableParserUtils.streamFrom(
        CommonUtils.getFileAsStream(getClass.getResource("/vdjtools.txt").getPath, false),
        Software.VDJtools,
        Species.Human,
        Gene.TRB
      )

      val table = new ClonotypeTable(clonotypesStream)

      val bytes  = new ByteArrayOutputStream(10485760)
      val output = new BufferedOutputStream(bytes, 4096)

      CachedClonotypeTable.write(output, table.getClonotypes)

      val input1  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 4096)
      val cached1 = CachedClonotypeTable.read(input1)
      var index1  = 0
      cached1
        .rows()
        .foreach(r => {
          checkEquality(index1, table.getClonotypes.get(index1), r)
          index1 += 1
        })

      val input2  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 16)
      val cached2 = CachedClonotypeTable.read(input2)
      var index2  = 100
      cached2
        .skip(100)
        .foreach(r => {
          checkEquality(index2, table.getClonotypes.get(index2), r)
          index2 += 1
        })

      val input3  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 65536)
      val cached3 = CachedClonotypeTable.read(input3)
      var index3  = 900
      cached3
        .skip(900)
        .take(10000)
        .foreach(r => {
          checkEquality(index3, table.getClonotypes.get(index3), r)
          index3 += 1
        })

      Assertions.succeed
    }

  }

}
