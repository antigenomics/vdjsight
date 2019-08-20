package analysis

import java.io.{FileInputStream, FileOutputStream, InputStream, OutputStream}
import java.nio.file.{Files, Paths}
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

    val create: String => Future[String] = (path: String) => {
      Using(new GZIPOutputStream(new FileOutputStream(path), 262144))(output => write(output))
      cacheProvider.create(sampleFile.uuid, analysisType, marker, action, path).map(_ => path)
    }

    val cachePath = s"${sampleFile.folder}/$analysisType-$marker.cache"
    cacheProvider.findForSampleForAnalysisWithMarkerAndTouch(sampleFile.uuid, analysisType, marker) flatMap {
      case Some(c) if Files.exists(Paths.get(c.cache)) => Future.successful(c.cache)
      case Some(c)                                     => cacheProvider.delete(c.uuid).flatMap(_ => create(cachePath))
      case None                                        => create(cachePath)
    } map (validatedCachePath => read(new GZIPInputStream(new FileInputStream(validatedCachePath), 262144)))
  }

}
