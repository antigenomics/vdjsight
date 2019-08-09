package analysis.clonotypes

import java.io.{FileInputStream, FileOutputStream}
import java.util.zip.{GZIPInputStream, GZIPOutputStream}

import analysis.AnalysisService
import analysis.clonotypes.cache.{LiteClonotypeTableReader, LiteClonotypeTableWriter}
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.segment.Gene
import com.antigenomics.mir.{CommonUtils, Species}
import com.google.inject.{Inject, Singleton}
import models.cache.{AnalysisCacheExpiredAction, AnalysisCacheProvider}
import models.sample.SampleFile

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ClonotypeTableAnalysisService @Inject()(analysis: AnalysisService, cache: AnalysisCacheProvider) {
  implicit val ec: ExecutionContext = analysis.executionContext

  def clonotypes(sampleFile: SampleFile, marker: String): Future[LiteClonotypeTable] = {
    cache.findForSampleForAnalysisWithMarkerAndTouch(sampleFile.uuid, ClonotypeTableAnalysisService.ANALYSIS_TYPE, marker) flatMap {
      case Some(c) => Future.successful(c.cache)
      case None =>
        val clonotypesStream = ClonotypeTableParserUtils.streamFrom(
          CommonUtils.getFileAsStream(sampleFile.locations.sample, sampleFile.extension == ".gz"),
          Software.valueOf(sampleFile.software),
          Species.valueOf(sampleFile.species),
          Gene.valueOf(sampleFile.gene)
        )

        val parsed = new ClonotypeTable(clonotypesStream)

        val cachePath = s"${sampleFile.folder}/cache-${ClonotypeTableAnalysisService.ANALYSIS_TYPE}-$marker.cache"
        val output    = new GZIPOutputStream(new FileOutputStream(cachePath), 262144)
        val writer    = LiteClonotypeTableWriter(output)

        var index = 1
        parsed.getClonotypes.forEach(cc => {
          writer.write(index, cc)
          index += 1
        })

        writer.close()

        cache.create(sampleFile.uuid, ClonotypeTableAnalysisService.ANALYSIS_TYPE, "default", AnalysisCacheExpiredAction.DELETE_FILE, cachePath) map { _ =>
          cachePath
        }
    } map { cache =>
      val input  = new GZIPInputStream(new FileInputStream(cache), 262144)
      val reader = LiteClonotypeTableReader(input)
      LiteClonotypeTable(reader)
    }
  }
}

object ClonotypeTableAnalysisService {
  final val ANALYSIS_TYPE: String = "clonotypes"
}
