package analysis

import models.cache.AnalysisCacheExpiredAction.AnalysisCacheExpiredAction
import models.cache.AnalysisCacheProvider
import models.sample.SampleFile

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

object AnalysisCacheHelper {

  type AnalysisCacheWriter    = () => Try[String]
  type AnalysisCacheValidator = String => Boolean
  type AnalysisCacheReader[T] = String => T

  def validateAndGetFromCache[T](sampleFile: SampleFile, analysisType: String, marker: String, action: AnalysisCacheExpiredAction)(
    implicit cacheProvider: AnalysisCacheProvider,
    writer: AnalysisCacheWriter,
    validator: AnalysisCacheValidator,
    reader: AnalysisCacheReader[T],
    ex: ExecutionContext
  ): Future[T] = {

    val create: () => Future[String] = () => {
      writer() match {
        case Success(cache)     => cacheProvider.create(sampleFile.uuid, analysisType, marker, action, cache).map(_ => cache)
        case Failure(exception) => throw exception
      }
    }

    cacheProvider.findForSampleForAnalysisWithMarkerAndTouch(sampleFile.uuid, analysisType, marker) flatMap {
      case Some(c) if validator(c.cache) => Future.successful(c.cache)
      case Some(c)                       => cacheProvider.delete(c.uuid).flatMap(_ => create())
      case None                          => create()
    } map (validatedCache => reader(validatedCache))
  }

}
