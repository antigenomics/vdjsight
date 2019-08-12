package analysis

import java.io.{FileInputStream, FileOutputStream, InputStream, OutputStream}
import java.util.zip.{GZIPInputStream, GZIPOutputStream}

import models.cache.AnalysisCacheExpiredAction.AnalysisCacheExpiredAction
import models.cache.AnalysisCacheProvider
import models.sample.SampleFile

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Using

object AnalysisCacheHelper {

  def validateCache[T](sampleFile: SampleFile, analysisType: String, marker: String, action: AnalysisCacheExpiredAction)(
    write: OutputStream => Unit
  )(
    read: InputStream => T
  )(implicit cacheProvider: AnalysisCacheProvider, ex: ExecutionContext): Future[T] = {
    cacheProvider.findForSampleForAnalysisWithMarkerAndTouch(sampleFile.uuid, analysisType, marker) flatMap {
      case Some(c) => Future.successful(c.cache)
      case None =>
        val cachePath = s"${sampleFile.folder}/cache-$analysisType-$marker.cache"
        Using(new GZIPOutputStream(new FileOutputStream(cachePath), 262144)) { output =>
          write(output)
        }
        cacheProvider.create(sampleFile.uuid, analysisType, marker, action, cachePath) map { _ =>
          cachePath
        }
    } map { cache =>
      read(new GZIPInputStream(new FileInputStream(cache), 262144))
    }
  }

}
