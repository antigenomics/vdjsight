package models.project

import models.ModelsTestTag
import specs.BaseTestSpecWithDatabaseAndApplication
import traits._

import scala.concurrent.Future
import scala.language.reflectiveCalls

class ProjectLinkSpec
    extends BaseTestSpecWithDatabaseAndApplication
    with DatabaseProviders
    with DatabaseUsers
    with DatabaseProjects
    with DatabaseProjectLinks
    with EffectsStream {

  "ProjectLinkProvider" should {

    "have proper table name" taggedAs ModelsTestTag in {
      plp.table.baseTableRow.tableName shouldEqual ProjectLinkTable.TABLE_NAME
    }

    "not be able to find not existing project link" taggedAs ModelsTestTag in {
      val user    = users.notExistingUser
      val project = projects.notExistingProject(user)
      val link    = projectLinks.notExistingProjectLink(user, project)
      for {
        notExisting <- plp.get(link.uuid)
      } yield notExisting should be(empty)
    }

    "be able to create and find existing project link" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        existing <- plp.get(link.uuid)
        _        <- existing should not be empty
        _        <- existing.get.isShared should be(false)
        _        <- existing.get.isUploadAllowed should be(true)
        _        <- existing.get.isDeleteAllowed should be(true)
        _        <- existing.get.isModificationAllowed should be(true)
        _        <- existing.get.uuid shouldEqual link.uuid
        _        <- existing.get.userID shouldEqual user.uuid
        check    <- existing.get.projectID shouldEqual project.uuid
      } yield check
    }

    "be able to create and find shared link" taggedAs ModelsTestTag in {
      val user    = users.notVerifiedUser
      val project = projects.existingProject(users.verifiedUser)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        existing <- plp.get(link.uuid)
        _        <- existing should not be empty
        _        <- existing.get.isShared should be(true)
        _        <- existing.get.isUploadAllowed should be(false)
        _        <- existing.get.isDeleteAllowed should be(false)
        _        <- existing.get.isModificationAllowed should be(false)
        _        <- existing.get.uuid shouldEqual link.uuid
        _        <- existing.get.userID shouldEqual user.uuid
        check    <- existing.get.projectID shouldEqual project.uuid
      } yield check
    }

    "be able to find links for user" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        existing   <- plp.get(link.uuid)
        _          <- existing should not be empty
        usersLinks <- plp.findForUser(user.uuid)
        check      <- usersLinks should contain(existing.get)
      } yield check
    }

    "be able to find links for user with project" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        existing              <- plp.get(link.uuid)
        _                     <- existing should not be empty
        usersLinksWithProject <- plp.findForUserWithProject(user.uuid)
        check                 <- usersLinksWithProject.map(p => (p._1, p._2.uuid)) should contain((existing.get, project.uuid))
      } yield check
    }

    "be able to find links for project" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        existing     <- plp.get(link.uuid)
        _            <- existing should not be empty
        projectLinks <- plp.findForProject(project.uuid)
        check        <- projectLinks should contain(existing.get)
      } yield check
    }

    "be able to find links for project with user" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        existing             <- plp.get(link.uuid)
        _                    <- existing should not be empty
        projectLinksWithUser <- plp.findForProjectWithUser(project.uuid)
        check                <- projectLinksWithUser.map(p => (p._1, p._2.uuid)) should contain((existing.get, user.uuid))
      } yield check
    }

    "be able to return link with user" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        existing <- plp.get(link.uuid)
        _        <- existing should not be empty
        withUser <- plp.getWithUser(existing.get.uuid)
        _        <- withUser should not be empty
        _        <- withUser.get._1.uuid shouldEqual existing.get.uuid
        _        <- withUser.get._1.userID shouldEqual withUser.get._2.uuid
        check    <- withUser.get._2.uuid shouldEqual user.uuid
      } yield check
    }

    "be able to return link with project" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        existing    <- plp.get(link.uuid)
        _           <- existing should not be empty
        withProject <- plp.getWithProject(existing.get.uuid)
        _           <- withProject should not be empty
        _           <- withProject.get._1.uuid shouldEqual existing.get.uuid
        _           <- withProject.get._1.projectID shouldEqual withProject.get._2.uuid
        check       <- withProject.get._2.uuid shouldEqual project.uuid
      } yield check
    }

    "not be able to create new project link for not existing project" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.notExistingProject(user)
      plp.create(user.uuid, project.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "not be able to create new project link for not existing user" taggedAs ModelsTestTag in {
      val user    = users.notExistingUser
      val project = projects.notExistingProject(user)
      plp.create(user.uuid, project.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "not be able to schedule deletion of not existing link" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.notExistingProjectLink(user, project)
      plp.scheduleDelete(link.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to schedule and cancel deletion of existing project (owner)" taggedAs ModelsTestTag in {
      val p       = events.probe[ProjectLinkProviderEvent]
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        scheduled            <- plp.scheduleDelete(link.uuid)
        _                    <- Future.successful(p.expectMsgType[ProjectLinkProviderEvents.ProjectLinkDeleteScheduled])
        check                <- scheduled should be(true)
        scheduledLink        <- plp.get(link.uuid)
        _                    <- scheduledLink should not be empty
        _                    <- scheduledLink.get.deleteOn should not be empty
        projectAfterSchedule <- pp.get(project.uuid)
        _                    <- projectAfterSchedule should not be empty
        _                    <- projectAfterSchedule.get.isDangling should be(true)
        cancelled            <- plp.cancelScheduledDelete(link.uuid)
        _                    <- Future.successful(p.expectMsgType[ProjectLinkProviderEvents.ProjectLinkDeleteCancelled])
        _                    <- cancelled should be(true)
        cancelledLink        <- plp.get(link.uuid)
        _                    <- cancelledLink should not be empty
        _                    <- cancelledLink.get.deleteOn should be(empty)
        projectAfterCancel   <- pp.get(project.uuid)
        _                    <- projectAfterCancel should not be empty
        _                    <- projectAfterCancel.get.isDangling should be(false)
      } yield check
    }

    "be able to schedule and cancel deletion of existing project (shared)" taggedAs ModelsTestTag in {
      val p       = events.probe[ProjectLinkProviderEvent]
      val user    = users.notVerifiedUser
      val project = projects.existingProject(users.verifiedUser)
      val link    = projectLinks.existingProjectLink(user, project)
      for {
        scheduled            <- plp.scheduleDelete(link.uuid)
        _                    <- Future.successful(p.expectMsgType[ProjectLinkProviderEvents.ProjectLinkDeleteScheduled])
        check                <- scheduled should be(true)
        scheduledLink        <- plp.get(link.uuid)
        _                    <- scheduledLink should not be empty
        _                    <- scheduledLink.get.deleteOn should not be empty
        projectAfterSchedule <- pp.get(project.uuid)
        _                    <- projectAfterSchedule should not be empty
        _                    <- projectAfterSchedule.get.isDangling should be(false)
        cancelled            <- plp.cancelScheduledDelete(link.uuid)
        _                    <- Future.successful(p.expectMsgType[ProjectLinkProviderEvents.ProjectLinkDeleteCancelled])
        _                    <- cancelled should be(true)
        cancelledLink        <- plp.get(link.uuid)
        _                    <- cancelledLink should not be empty
        _                    <- cancelledLink.get.deleteOn should be(empty)
        projectAfterCancel   <- pp.get(project.uuid)
        _                    <- projectAfterCancel should not be empty
        _                    <- projectAfterCancel.get.isDangling should be(false)
      } yield check
    }

    "not be able to delete not existing project link" taggedAs ModelsTestTag in {
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.notExistingProjectLink(user, project)
      plp.delete(link.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to delete project link" taggedAs ModelsTestTag in {
      val el      = events.probe[ProjectLinkProviderEvent]
      val ep      = events.probe[ProjectProviderEvent]
      val user    = users.verifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)

      for {
        delete                 <- plp.delete(link.uuid)
        _                      <- Future.successful(el.expectMsgType[ProjectLinkProviderEvents.ProjectLinkDeleted])
        _                      <- Future.successful(ep.expectMsgType[ProjectProviderEvents.ProjectDeleted])
        deletedLinkInDB        <- plp.get(link.uuid)
        _                      <- deletedLinkInDB should be(empty)
        deletedProjectFileInDB <- pp.get(link.project.uuid)
        _                      <- deletedProjectFileInDB should be(empty)
        check                  <- delete should be(true)
      } yield check
    }

    "automatically delete all links for project after its deleting" taggedAs ModelsTestTag in {
      val user    = users.notVerifiedUser
      val project = projects.existingProject(user)
      val link    = projectLinks.existingProjectLink(user, project)
      val shared  = projectLinks.existingProjectLink(users.verifiedUser, project)

      for {
        linkInDBBeforeDeletion   <- plp.get(link.uuid)
        sharedInDBBeforeDeletion <- plp.get(shared.uuid)
        _                        <- linkInDBBeforeDeletion should not be empty
        _                        <- sharedInDBBeforeDeletion should not be empty
        deleted                  <- pp.delete(project.uuid)
        _                        <- deleted.uuid shouldEqual project.uuid
        linkInDB                 <- plp.get(link.uuid)
        sharedInDB               <- plp.get(shared.uuid)
        _                        <- linkInDB should be(empty)
        check                    <- sharedInDB should be(empty)
      } yield check
    }

  }

}
