package analysis.clonotypes

import java.io.{InputStream, OutputStream}
import java.util.stream.Collectors

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

  def clonotypes(sampleFile: SampleFile, marker: String, options: ClonotypeTableAnalysisOptions): Future[CachedClonotypeTable] = {

    val readProcedure: InputStream => CachedClonotypeTable = (input) => CachedClonotypeTable.read(input)
    val writeProcedure: OutputStream => Unit = (output) => {
      val clonotypesStream = ClonotypeTableParserUtils.streamFrom(
        CommonUtils.getFileAsStream(sampleFile.locations.sample, sampleFile.extension == ".gz"),
        Software.valueOf(sampleFile.software),
        Species.valueOf(sampleFile.species),
        Gene.valueOf(sampleFile.gene)
      )

      val table = new ClonotypeTable(clonotypesStream)

      val clonotypes = if (options.sort != "none") {
        val s"$column:$direction" = options.sort
        table
          .stream()
          .sorted((left, right) => {
            val check = column match {
              case "count"  => left.getCount.compareTo(right.getCount)
              case "freq"   => left.getFrequency.compareTo(right.getCount)
              case "cdr3aa" => left.getCdr3Aa.compareTo(right.getCdr3Aa)
              case "v"      => left.getBestVariableSegment.toString.compareTo(right.getBestVariableSegment.toString)
              case "d"      => left.getBestDiversitySegment.toString.compareTo(right.getBestDiversitySegment.toString)
              case "j"      => left.getBestJoiningSegment.toString.compareTo(right.getBestJoiningSegment.toString)
              case _        => 0
            }

            direction match {
              case "asc"  => check
              case "desc" => -check
              case _      => 0
            }

          })
          .collect(Collectors.toList())
      } else {
        table.getClonotypes
      }

      CachedClonotypeTable.write(output, clonotypes)
    }

    AnalysisCacheHelper.validateCache(
      sampleFile,
      ClonotypeTableAnalysisService.ANALYSIS_TYPE,
      s"$marker-${CachedClonotypeTable.VERSION}",
      AnalysisCacheExpiredAction.DELETE_FILE
    )(writeProcedure)(readProcedure)
  }
}

object ClonotypeTableAnalysisService {
  final val ANALYSIS_TYPE: String = "clonotypes"
}
