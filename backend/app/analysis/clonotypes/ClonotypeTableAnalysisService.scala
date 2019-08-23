package analysis.clonotypes

import java.io.{FileInputStream, FileOutputStream}
import java.nio.file.{Files, Paths}
import java.util.zip.{GZIPInputStream, GZIPOutputStream}

import analysis.AnalysisCacheHelper.{AnalysisCacheReader, AnalysisCacheValidator, AnalysisCacheWriter}
import analysis.{AnalysisCacheHelper, AnalysisService}
import com.antigenomics.mir.clonotype.io.ClonotypeTablePipe
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.rearrangement.ReadlessClonotypeImpl
import com.antigenomics.mir.clonotype.{Clonotype, ClonotypeCall}
import com.antigenomics.mir.segment.Gene
import com.antigenomics.mir.{CommonUtils, Species}
import com.google.inject.{Inject, Singleton}
import models.cache.{AnalysisCacheExpiredAction, AnalysisCacheProvider}
import models.sample.SampleFile
import server.BadRequestException
import utils.StreamUtils

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Using

@Singleton
class ClonotypeTableAnalysisService @Inject()(analysis: AnalysisService)(implicit cache: AnalysisCacheProvider) {
  implicit val ec: ExecutionContext = analysis.executionContext

  def makeClonotypesStream(sampleFile: SampleFile, options: ClonotypeTableAnalysisOptions): LazyList[ClonotypeCall[ReadlessClonotypeImpl]] = {
    val stream = try {
      ClonotypeTableParserUtils
        .streamFrom(
          CommonUtils.getFileAsStream(sampleFile.locations.sample, sampleFile.extension == ".gz"),
          Software.valueOf(sampleFile.software),
          Species.valueOf(sampleFile.species),
          Gene.valueOf(sampleFile.gene)
        )
        .asInstanceOf[ClonotypeTablePipe[ReadlessClonotypeImpl]]
    } catch {
      case _: Throwable => throw BadRequestException("Clonotypes", "Invalid sample file format. Consider to check sample's software type")
    }

    val clonotypesStream = StreamUtils.makeLazyList(new StreamUtils.StreamLike[ClonotypeCall[ReadlessClonotypeImpl]] {
      override def hasNext: Boolean = stream.hasNext
      override def next: ClonotypeCall[ReadlessClonotypeImpl] = {
        try {
          stream.next()
        } catch {
          case _: Throwable => throw BadRequestException("Clonotypes", "Sample parse error")
        }
      }
    })

    if (options.sort != "none") {
      val s"$column:$direction" = options.sort
      clonotypesStream.sortWith((left, right) => {
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
          case "asc"  => check < 0
          case "desc" => check > 0
          case _      => false
        }

      })
    } else {
      clonotypesStream
    }
  }

  def makeReader: AnalysisCacheHelper.AnalysisCacheReader[CachedClonotypeTable] = (cache) => {
    val s"$size:$path" = cache
    val input          = new GZIPInputStream(new FileInputStream(path), 262144)
    CachedClonotypeTable.read(size.toInt, input)
  }

  def makeValidator: AnalysisCacheHelper.AnalysisCacheValidator = (cache) => {
    val s"$size:$path" = cache
    Files.exists(Paths.get(path))
  }

  def makeWriter(sampleFile: SampleFile, marker: String, options: ClonotypeTableAnalysisOptions): AnalysisCacheHelper.AnalysisCacheWriter = () => {
    val cachePath = s"${sampleFile.folder}/${ClonotypeTableAnalysisService.ANALYSIS_TYPE}-$marker-${CachedClonotypeTable.VERSION}.cache"
    Using(new GZIPOutputStream(new FileOutputStream(cachePath), 262144)) { output =>
      CachedClonotypeTable.write(output, makeClonotypesStream(sampleFile, options))
    } map (size => s"$size:$cachePath")
  }

  def clonotypes(sampleFile: SampleFile, marker: String, options: ClonotypeTableAnalysisOptions): Future[CachedClonotypeTable] = {

    implicit val reader: AnalysisCacheReader[CachedClonotypeTable] = makeReader
    implicit val validator: AnalysisCacheValidator                 = makeValidator
    implicit val writer: AnalysisCacheWriter                       = makeWriter(sampleFile, marker, options)

    AnalysisCacheHelper.validateAndGetFromCache[CachedClonotypeTable](
      sampleFile,
      ClonotypeTableAnalysisService.ANALYSIS_TYPE,
      s"$marker-${CachedClonotypeTable.VERSION}",
      AnalysisCacheExpiredAction.DELETE_FILE
    )
  }
}

object ClonotypeTableAnalysisService {
  final val ANALYSIS_TYPE: String = "clonotypes"
}
