package analysis

import java.util.concurrent.ForkJoinPool

import com.google.inject.{Inject, Singleton}
import com.typesafe.config.Config
import play.api.{ConfigLoader, Configuration}

import scala.concurrent.ExecutionContext

case class AnalysisExecutionPoolConfiguration(threads: Int)

object AnalysisExecutionPoolConfiguration {
  implicit val analysisExecutionPoolConfigurationLoader: ConfigLoader[AnalysisExecutionPoolConfiguration] = (root: Config, path: String) => {
    val config = root.getConfig(path)
    AnalysisExecutionPoolConfiguration(
      threads = config.getInt("threads")
    )
  }
}

@Singleton
class AnalysisService @Inject()(conf: Configuration) {
  final private val analysisPoolConfiguration = conf.get[AnalysisExecutionPoolConfiguration]("application.analysis.pool")

  final private val pool: ForkJoinPool   = new ForkJoinPool(analysisPoolConfiguration.threads, ForkJoinPool.defaultForkJoinWorkerThreadFactory, null, true)
  final private val ec: ExecutionContext = ExecutionContext.fromExecutorService(pool)

  def executionContext: ExecutionContext = ec
}
