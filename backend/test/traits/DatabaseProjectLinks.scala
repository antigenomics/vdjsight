package traits

import java.util.UUID

import models.project.{ProjectLinkProviderEvent, ProjectLinkProviderEvents}
import org.scalatest.{Matchers, OptionValues}

import scala.concurrent.Await
import scala.concurrent.duration.Duration

import scala.language.reflectiveCalls

trait DatabaseProjectLinks extends Matchers with OptionValues with DatabaseProviders with DatabaseUsers with DatabaseProjects with EffectsStream {

  case class TestProjectLink(uuid: UUID, user: TestUser, project: TestProject)

  private def generateNotExistingProjectLink(user: TestUser, project: TestProject): TestProjectLink = {
    val uuid = UUID.randomUUID()

    val isExistByUUID = Await.result(plp.get(uuid), Duration.Inf)

    isExistByUUID should be(empty)

    TestProjectLink(uuid, user, project)
  }

  private def generateExistingProjectLink(user: TestUser, project: TestProject): TestProjectLink = {
    val projectLinkEventProbe = events.probe[ProjectLinkProviderEvent]

    val link = Await.result(
      plp.create(
        user.uuid,
        project.uuid,
        isUploadAllowed       = project.user.uuid === user.uuid,
        isDeleteAllowed       = project.user.uuid === user.uuid,
        isModificationAllowed = project.user.uuid === user.uuid
      ),
      Duration.Inf
    )

    projectLinkEventProbe.expectMsgType[ProjectLinkProviderEvents.ProjectLinkCreated]

    TestProjectLink(link.uuid, user, project)
  }

  type TestProjectLinksMap = scala.collection.mutable.Map[TestUser, scala.collection.mutable.Map[TestProject, TestProjectLink]]

  private var _notExistingProjectLinks: TestProjectLinksMap = scala.collection.mutable.Map()
  private var _existingProjectLinks: TestProjectLinksMap    = scala.collection.mutable.Map()

  final val projectLinks = new {

    def notExistingProjectLink(user: TestUser, project: TestProject): TestProjectLink =
      _notExistingProjectLinks
        .getOrElseUpdate(user, scala.collection.mutable.Map())
        .getOrElseUpdate(project, generateNotExistingProjectLink(user, project))

    def existingProjectLink(user: TestUser, project: TestProject): TestProjectLink =
      _existingProjectLinks
        .getOrElseUpdate(user, scala.collection.mutable.Map())
        .getOrElseUpdate(project, generateExistingProjectLink(user, project))

  }
}
