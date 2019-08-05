package traits

import java.util.UUID

import models.sample.{SampleFileLinkProviderEvent, SampleFileLinkProviderEvents}
import org.scalatest.{Matchers, OptionValues}

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.language.reflectiveCalls

trait DatabaseSampleFileLinks extends Matchers with OptionValues with DatabaseProviders with DatabaseSampleFiles with DatabaseProjects with EffectsStream {

  case class TestSampleFileLink(uuid: UUID, sampleFile: TestSampleFile, project: TestProject)

  private def generateNotExistingSampleFileLink(sampleFile: TestSampleFile, project: TestProject): TestSampleFileLink = {
    val uuid = UUID.randomUUID()

    val isExistByUUID = Await.result(sflp.get(uuid), Duration.Inf)

    isExistByUUID should be(empty)

    TestSampleFileLink(uuid, sampleFile, project)
  }

  private def generateExistingSampleFileLink(sampleFile: TestSampleFile, project: TestProject): TestSampleFileLink = {
    val sampleFileLinkEventProbe = events.probe[SampleFileLinkProviderEvent]

    val link = Await.result(sflp.create(sampleFile.uuid, project.uuid, project.user.uuid), Duration.Inf)

    sampleFileLinkEventProbe.expectMsgType[SampleFileLinkProviderEvents.SampleFileLinkCreated]

    TestSampleFileLink(link.uuid, sampleFile, project)
  }

  type TestSampleFileLinksMap = scala.collection.mutable.Map[TestSampleFile, scala.collection.mutable.Map[TestProject, TestSampleFileLink]]

  private var _notExistingSampleFileLinks: TestSampleFileLinksMap = scala.collection.mutable.Map()
  private var _existingSampleFileLinks: TestSampleFileLinksMap    = scala.collection.mutable.Map()

  final val sampleFileLinks = new {

    def notExistingSampleFileLink(sampleFile: TestSampleFile, project: TestProject): TestSampleFileLink =
      _notExistingSampleFileLinks
        .getOrElseUpdate(sampleFile, scala.collection.mutable.Map())
        .getOrElseUpdate(project, generateNotExistingSampleFileLink(sampleFile, project))

    def existingSampleFileLink(sampleFile: TestSampleFile, project: TestProject): TestSampleFileLink =
      _existingSampleFileLinks
        .getOrElseUpdate(sampleFile, scala.collection.mutable.Map())
        .getOrElseUpdate(project, generateExistingSampleFileLink(sampleFile, project))

  }
}
