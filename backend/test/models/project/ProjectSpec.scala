package models.project

import models.ModelsTestTag
import specs.BaseTestSpecWithDatabaseAndApplication
import traits.{DatabaseProjects, DatabaseProviders, DatabaseUsers, EffectsStream}

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.{postfixOps, reflectiveCalls}

class ProjectSpec extends BaseTestSpecWithDatabaseAndApplication with DatabaseProviders with DatabaseUsers with DatabaseProjects with EffectsStream {

  "ProjectProvider" should {

    "have proper table name" taggedAs ModelsTestTag in {
      pp.table.baseTableRow.tableName shouldEqual ProjectTable.TABLE_NAME
    }

    "not be able to find not existing project" taggedAs ModelsTestTag in {
      for {
        notExisting <- pp.get(projects.notExistingProject(users.verifiedUser).uuid)
      } yield notExisting should be(empty)
    }

    "be able to find existing project" taggedAs ModelsTestTag in {
      for {
        existing <- pp.get(projects.existingProject(users.verifiedUser).uuid)
        _        <- existing should not be empty
        _        <- existing.get.uuid shouldEqual projects.existingProject(users.verifiedUser).uuid
        check    <- existing.get.name shouldEqual projects.existingProject(users.verifiedUser).name
      } yield check
    }

    "be able to find projects for owner" taggedAs ModelsTestTag in {
      for {
        existing <- pp.get(projects.existingProject(users.verifiedUser).uuid)
        _        <- existing should not be empty
        owners   <- pp.findForOwner(users.verifiedUser.uuid)
        check    <- owners should contain(existing.get)
      } yield check
    }

    "be able to return project with owner" taggedAs ModelsTestTag in {
      for {
        existing  <- pp.get(projects.existingProject(users.verifiedUser).uuid)
        _         <- existing should not be empty
        withOwner <- pp.getWithOwner(existing.get.uuid)
        _         <- withOwner should not be empty
        _         <- withOwner.get._1.uuid shouldEqual existing.get.uuid
        _         <- withOwner.get._1.ownerID shouldEqual withOwner.get._2.uuid
        check     <- withOwner.get._2.uuid shouldEqual users.verifiedUser.uuid
      } yield check
    }

    "not be able to create new project for not existing user" taggedAs ModelsTestTag in {
      val p = events.probe[ProjectProviderEvent]
      pp.create(users.notExistingUser.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        p.expectNoMessage(100 milliseconds)
        w.await()
      }
    }

    "be able to create new project" taggedAs ModelsTestTag in {
      val p = events.probe[ProjectProviderEvent]
      for {
        created <- pp.create(users.verifiedUser.uuid, "name", "description", overrideConfiguration = Some(ProjectsConfiguration("path", 10)))
        _       <- Future(p.expectMsgType[ProjectProviderEvents.ProjectCreated])
        _       <- created.ownerID shouldEqual users.verifiedUser.uuid
        _       <- created.name shouldEqual "name"
        _       <- created.description shouldEqual "description"
        _       <- created.folder should include("path")
        check   <- created.maxSamplesCount shouldEqual 10
      } yield check
    }

    "be able to create project with user permission by default" taggedAs ModelsTestTag in {
      val p = events.probe[ProjectProviderEvent]
      for {
        created     <- pp.create(users.verifiedUser.uuid, overrideConfiguration = Some(ProjectsConfiguration("path", 0)))
        _           <- Future(p.expectMsgType[ProjectProviderEvents.ProjectCreated])
        _           <- created.ownerID shouldEqual users.verifiedUser.uuid
        _           <- created.folder should include("path")
        permissions <- upp.findForUser(users.verifiedUser.uuid)
        _           <- permissions should not be empty
        check       <- created.maxSamplesCount shouldEqual permissions.get.maxSamplesCount
      } yield check
    }

    "not be able to update not existing project" taggedAs ModelsTestTag in {
      val p = events.probe[ProjectProviderEvent]
      pp.update(projects.notExistingProject(users.verifiedUser).uuid, "new-name", "new-description").map(_ => w.dismiss())
      assertThrows[Exception] {
        p.expectNoMessage(100 milliseconds)
        w.await()
      }
    }

    "be able to update existing project" taggedAs ModelsTestTag in {
      val p = events.probe[ProjectProviderEvent]
      for {
        project <- pp.update(projects.existingProject(users.verifiedUser).uuid, "new-name", "new-description")
        _         <- Future(p.expectMsgType[ProjectProviderEvents.ProjectUpdated])
        _         <- project.uuid shouldEqual projects.existingProject(users.verifiedUser).uuid
        updated   <- pp.get(projects.existingProject(users.verifiedUser).uuid)
        _         <- updated should not be empty
        _         <- updated.get.name shouldEqual "new-name"
        check     <- updated.get.description shouldEqual "new-description"
      } yield check
    }

  }

}
