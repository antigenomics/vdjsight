package traits

import java.util.UUID

import models.sample.{SampleFileProviderEvent, SampleFileProviderEvents}
import org.scalatest.{Matchers, OptionValues}

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.language.reflectiveCalls

trait DatabaseSampleFiles extends Matchers with OptionValues with DatabaseProviders with DatabaseUsers with EffectsStream {

  case class TestSampleFile(uuid: UUID, name: String, software: String, user: TestUser)

  private def generateNotExistingSampleFile(user: TestUser): TestSampleFile = {
    val uuid = UUID.randomUUID()

    val isExistByUUID = Await.result(sfp.get(uuid), Duration.Inf)

    isExistByUUID should be(empty)

    TestSampleFile(uuid, "not-existing-sample-file", "vdjtools", user)
  }

  private def generateExistingSampleFile(user: TestUser): TestSampleFile = {
    val sampleEventProbe = events.probe[SampleFileProviderEvent]
    val name             = "existing-sample-file"
    val software         = "vdjtools"
    val sample           = Await.result(sfp.create(user.uuid, name, software), Duration.Inf)

    sampleEventProbe.expectMsgType[SampleFileProviderEvents.SampleFileCreated]

    TestSampleFile(sample.uuid, name, software, user)
  }

  type TestSampleFilesMap = scala.collection.mutable.Map[TestUser, TestSampleFile]

  private var _notExistingSampleFiles: TestSampleFilesMap = scala.collection.mutable.Map()
  private var _existingSampleFiles: TestSampleFilesMap    = scala.collection.mutable.Map()

  final val sampleFiles = new {

    def notExistingSampleFile(user: TestUser): TestSampleFile = _notExistingSampleFiles.getOrElseUpdate(user, generateNotExistingSampleFile(user))
    def existingSampleFile(user: TestUser): TestSampleFile    = _existingSampleFiles.getOrElseUpdate(user, generateExistingSampleFile(user))

  }

}
