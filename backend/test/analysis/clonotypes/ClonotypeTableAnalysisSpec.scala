package analysis.clonotypes

import java.io.{BufferedInputStream, BufferedOutputStream, ByteArrayInputStream, ByteArrayOutputStream}

import analysis.AnalysisTestTag
import analysis.clonotypes.cache.{LiteClonotypeTableReader, LiteClonotypeTableWriter}
import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.segment.{Gene, MissingDiversitySegment, MissingJoiningSegment, MissingVariableSegment}
import com.antigenomics.mir.{CommonUtils, Species}
import org.scalatest.{Assertion, Assertions}
import specs.BaseTestSpec

class ClonotypeTableAnalysisSpec extends BaseTestSpec {

  "ClonotypeTableAnalysis" should {

    "be able to create and verify cache for clonotype table" taggedAs AnalysisTestTag in {

      def checkEquality[C <: Clonotype](index: Int, cc: ClonotypeCall[C], r: LiteClonotypeTableRow): Assertion = {
        val bv = cc.getBestVariableSegment
        val bd = cc.getBestDiversitySegment
        val bj = cc.getBestJoiningSegment

        r.index shouldEqual (index + 1)
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

      val parsed = new ClonotypeTable(clonotypesStream)

      val bytes  = new ByteArrayOutputStream(10485760)
      val output = new BufferedOutputStream(bytes, 4096)
      val writer = LiteClonotypeTableWriter(output)

      var write_index = 1
      parsed.getClonotypes.forEach(cc => {
        writer.write(write_index, cc)
        write_index += 1
      })

      writer.end()

      val input1  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 4096)
      val reader1 = LiteClonotypeTableReader(input1)
      val table1 = LiteClonotypeTable(reader1)

      var read_index = 0
      table1
        .rows()
        .foreach(r => {
          checkEquality(read_index, parsed.getClonotypes.get(read_index), r)
          read_index += 1
        })


      val input2  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 16)
      val reader2 = LiteClonotypeTableReader(input2)
      val table2 = LiteClonotypeTable(reader2)

      read_index = 100
      table2.skip(100).foreach(r => {
        checkEquality(read_index, parsed.getClonotypes.get(read_index), r)
        read_index += 1
      })

      val input3  = new BufferedInputStream(new ByteArrayInputStream(bytes.toByteArray), 16)
      val reader3 = LiteClonotypeTableReader(input3)
      val table3 = LiteClonotypeTable(reader3)

      read_index = 900
      table3.skip(900).take(100000).foreach(r => {
        checkEquality(read_index, parsed.getClonotypes.get(read_index), r)
        read_index += 1
      })

      Assertions.succeed
    }

  }

}
