package traits

import java.util.UUID

import models.project.{ProjectProviderEvent, ProjectProviderEvents}
import org.scalatest.{Matchers, OptionValues}

import scala.concurrent.Await
import scala.concurrent.duration.Duration
import scala.language.reflectiveCalls

trait DatabaseProjects extends Matchers with OptionValues with DatabaseProviders with DatabaseUsers with EffectsStream {

  case class TestProject(uuid: UUID, name: String, user: TestUser)

  private def generateNotExistingProject(user: TestUser): TestProject = {
    val uuid = UUID.randomUUID()

    val isExistByUUID = Await.result(pp.get(uuid), Duration.Inf)

    isExistByUUID should be(empty)

    TestProject(uuid, "not-existing-project", user)
  }

  private def generateExistingProject(user: TestUser): TestProject = {
    val projectEventProbe = events.probe[ProjectProviderEvent]
    val name              = "existing-project"
    val project           = Await.result(pp.create(user.uuid, name), Duration.Inf)

    projectEventProbe.expectMsgType[ProjectProviderEvents.ProjectCreated]

    TestProject(project.uuid, name, user)
  }

  type TestProjectsMap = scala.collection.mutable.Map[TestUser, TestProject]

  private var _notExistingProjects: TestProjectsMap = scala.collection.mutable.Map()
  private var _existingProjects: TestProjectsMap    = scala.collection.mutable.Map()

  final val projects = new {

    def notExistingProject(user: TestUser): TestProject = _notExistingProjects.getOrElseUpdate(user, generateNotExistingProject(user))
    def existingProject(user: TestUser): TestProject    = _existingProjects.getOrElseUpdate(user, generateExistingProject(user))

  }

}
