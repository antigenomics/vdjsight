package analysis.clonotypes

import analysis.{AnalysisCacheHelper, AnalysisService}
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.segment.Gene
import com.antigenomics.mir.{CommonUtils, Species}
import com.google.inject.{Inject, Singleton}
import models.cache.{AnalysisCacheExpiredAction, AnalysisCacheProvider}
import models.sample.SampleFile

import scala.concurrent.{ExecutionContext, Future}

@Singleton
class ClonotypeTableAnalysisService @Inject()(analysis: AnalysisService)(implicit cache: AnalysisCacheProvider) {
  implicit val ec: ExecutionContext = analysis.executionContext

  def clonotypes(sampleFile: SampleFile, marker: String): Future[CachedClonotypeTable] = {
    AnalysisCacheHelper.validateCache(
      sampleFile,
      ClonotypeTableAnalysisService.ANALYSIS_TYPE,
      s"$marker-${CachedClonotypeTable.VERSION}",
      AnalysisCacheExpiredAction.DELETE_FILE
    ) { output =>
      val clonotypesStream = ClonotypeTableParserUtils.streamFrom(
        CommonUtils.getFileAsStream(sampleFile.locations.sample, sampleFile.extension == ".gz"),
        Software.valueOf(sampleFile.software),
        Species.valueOf(sampleFile.species),
        Gene.valueOf(sampleFile.gene)
      )
      val table = new ClonotypeTable(clonotypesStream)
      CachedClonotypeTable.write(output, table)
    } { input =>
      CachedClonotypeTable.read(input)
    }
  }
}

object ClonotypeTableAnalysisService {
  final val ANALYSIS_TYPE: String = "clonotypes"
}
