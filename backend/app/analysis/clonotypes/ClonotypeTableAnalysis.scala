package analysis.clonotypes

import java.io.{FileInputStream, FileOutputStream}
import java.util.zip.{GZIPInputStream, GZIPOutputStream}

import analysis.clonotypes.cache.{LiteClonotypeTableReader, LiteClonotypeTableWriter}
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.segment.Gene
import com.antigenomics.mir.{CommonUtils, Species}
import models.cache.{AnalysisCacheExpiredAction, AnalysisCacheProvider}
import models.sample.SampleFile

import scala.concurrent.{ExecutionContext, Future}

object ClonotypeTableAnalysis {
  final val ANALYSIS_TYPE: String = "clonotypes"

  def clonotypes(sampleFile: SampleFile, marker: String)(implicit cache: AnalysisCacheProvider, ec: ExecutionContext): Future[LiteClonotypeTable] = {
    cache.findForSampleForAnalysisWithMarkerAndTouch(sampleFile.uuid, ClonotypeTableAnalysis.ANALYSIS_TYPE, marker) flatMap {
      case Some(c) => Future(c.cache)
      case None =>
        val clonotypesStream = ClonotypeTableParserUtils.streamFrom(
          CommonUtils.getFileAsStream(sampleFile.locations.sample, sampleFile.extension == ".gz"),
          Software.VDJtools,
          Species.Human,
          Gene.TRB
        )

        val parsed = new ClonotypeTable(clonotypesStream)

        val cachePath = s"${sampleFile.folder}/cache-${ClonotypeTableAnalysis.ANALYSIS_TYPE}-$marker.cache"
        val output    = new GZIPOutputStream(new FileOutputStream(cachePath), 262144)
        val writer    = LiteClonotypeTableWriter(output)

        var index = 1
        parsed.getClonotypes.forEach(cc => {
          writer.write(index, cc)
          index += 1
        })

        writer.close()

        cache.create(sampleFile.uuid, ClonotypeTableAnalysis.ANALYSIS_TYPE, "default", AnalysisCacheExpiredAction.DELETE_FILE, cachePath) map { _ =>
          cachePath
        }
    } map { cache =>
      val input  = new GZIPInputStream(new FileInputStream(cache), 262144)
      val reader = LiteClonotypeTableReader(input)
      LiteClonotypeTable(reader)
    }
  }

}
