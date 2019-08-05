package analysis.clonotypes

import java.io.{FileInputStream, FileOutputStream}
import java.nio.ByteBuffer
import java.nio.file.{Files, Paths}
import java.util.zip.{GZIPInputStream, GZIPOutputStream}

import boopickle.BufferPool
import boopickle.Default._
import com.antigenomics.mir.clonotype.parser.{ClonotypeTableParserUtils, Software}
import com.antigenomics.mir.clonotype.table.ClonotypeTable
import com.antigenomics.mir.segment.Gene
import com.antigenomics.mir.{CommonUtils, Species}
import models.cache.{AnalysisCacheExpiredAction, AnalysisCacheProvider}
import models.sample.SampleFile

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try, Using}

object ClonotypeTableAnalysis {
  final val ANALYSIS_TYPE: String = "clonotypes"

  def clonotypes(sampleFile: SampleFile, marker: String)(implicit cache: AnalysisCacheProvider, ec: ExecutionContext): Future[LiteClonotypeTable] = {
    val a: Future[Try[LiteClonotypeTable]] = cache.findForSampleForAnalysisWithMarkerAndTouch(sampleFile.uuid, ClonotypeTableAnalysis.ANALYSIS_TYPE, marker) map {
        case Some(c) =>
          Using(new GZIPInputStream(new FileInputStream(c.cache))) { gz =>
            val buffer = ByteBuffer.wrap(gz.readAllBytes())
            Unpickle[LiteClonotypeTable].fromBytes(buffer)
          }
        case None =>
          val clonotypesStream = ClonotypeTableParserUtils.streamFrom(
            CommonUtils.getFileAsStream(sampleFile.locations.sample, sampleFile.extension == ".gz"),
            Software.VDJtools,
            Species.Human,
            Gene.TRA
          )

          val parsed                    = new ClonotypeTable(clonotypesStream)
          val table: LiteClonotypeTable = LiteClonotypeTable.from(parsed)

          val data      = Pickle.intoBytes(table)
          val cachePath = s"${sampleFile.folder}/cache-${ClonotypeTableAnalysis.ANALYSIS_TYPE}-$marker.gz"
          Using(new GZIPOutputStream(new FileOutputStream(cachePath))) { gz =>
            gz.write(data.array())
            BufferPool.release(data)

            cache.create(sampleFile.uuid, ClonotypeTableAnalysis.ANALYSIS_TYPE, marker, AnalysisCacheExpiredAction.DELETE_FILE, cachePath) onComplete {
              case Success(_) =>
              case Failure(ex) =>
                println("Failed to create cache: TODO")
                Files.deleteIfExists(Paths.get(cachePath))
            }
          }.map(_ => table)
      }

    a.map {
      case Success(v)  => v
      case Failure(ex) => throw new RuntimeException("Some error todo", ex)
    }
  }

}
