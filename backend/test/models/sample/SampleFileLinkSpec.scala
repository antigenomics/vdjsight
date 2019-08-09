package models.sample

import models.ModelsTestTag
import specs.BaseTestSpecWithDatabaseAndApplication
import traits._

import scala.concurrent.Future
import scala.language.reflectiveCalls

class SampleFileLinkSpec
    extends BaseTestSpecWithDatabaseAndApplication
    with DatabaseProviders
    with DatabaseUsers
    with DatabaseProjects
    with DatabaseSampleFiles
    with DatabaseSampleFileLinks
    with EffectsStream {

  "SampleFileLinkProvider" should {

    "have proper table name" taggedAs ModelsTestTag in {
      sflp.table.baseTableRow.tableName shouldEqual SampleFileLinkTable.TABLE_NAME
    }

    "not be able to find not existing sample file link" taggedAs ModelsTestTag in {
      val user       = users.notExistingUser
      val sampleFile = sampleFiles.notExistingSampleFile(user)
      val project    = projects.notExistingProject(user)
      val link       = sampleFileLinks.notExistingSampleFileLink(sampleFile, project)
      for {
        notExisting <- sflp.get(link.uuid)
      } yield notExisting should be(empty)
    }

    "be able to create and find existing sample file link" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)
      for {
        existing <- sflp.get(link.uuid)
        _        <- existing should not be empty
        _        <- existing.get.uuid shouldEqual link.uuid
        _        <- existing.get.sampleID shouldEqual sampleFile.uuid
        check    <- existing.get.projectID shouldEqual project.uuid
      } yield check
    }

    "be able to find links for sample" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)
      for {
        existing     <- sflp.get(link.uuid)
        _            <- existing should not be empty
        samplesLinks <- sflp.findForSample(sampleFile.uuid)
        check        <- samplesLinks should contain(existing.get)
      } yield check
    }

    "be able to find links for sample with project" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)
      for {
        existing                <- sflp.get(link.uuid)
        _                       <- existing should not be empty
        samplesLinksWithProject <- sflp.findForSampleWithProject(sampleFile.uuid)
        check                   <- samplesLinksWithProject.map(p => (p._1, p._2.uuid)) should contain((existing.get, project.uuid))
      } yield check
    }

    "be able to find links for project" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)
      for {
        existing     <- sflp.get(link.uuid)
        _            <- existing should not be empty
        projectLinks <- sflp.findForProject(project.uuid)
        check        <- projectLinks should contain(existing.get)
      } yield check
    }

    "be able to find links for project with sample" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)
      for {
        existing               <- sflp.get(link.uuid)
        _                      <- existing should not be empty
        projectLinksWithSample <- sflp.findForProjectWithSample(project.uuid)
        check                  <- projectLinksWithSample.map(p => (p._1, p._2.uuid)) should contain((existing.get, sampleFile.uuid))
      } yield check
    }

    "be able to return link with sample" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)
      for {
        existing   <- sflp.get(link.uuid)
        _          <- existing should not be empty
        withSample <- sflp.getWithSample(existing.get.uuid)
        _          <- withSample should not be empty
        _          <- withSample.get._1.uuid shouldEqual existing.get.uuid
        _          <- withSample.get._1.sampleID shouldEqual withSample.get._2.uuid
        check      <- withSample.get._2.uuid shouldEqual sampleFile.uuid
      } yield check
    }

    "be able to return link with project" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)
      for {
        existing    <- sflp.get(link.uuid)
        _           <- existing should not be empty
        withProject <- sflp.getWithProject(existing.get.uuid)
        _           <- withProject should not be empty
        _           <- withProject.get._1.uuid shouldEqual existing.get.uuid
        _           <- withProject.get._1.projectID shouldEqual withProject.get._2.uuid
        check       <- withProject.get._2.uuid shouldEqual project.uuid
      } yield check
    }

    "not be able to create new sample file link for not existing project" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.notExistingProject(user)
      sflp.create(sampleFile.uuid, project.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "not be able to create new sample file link for not existing sample" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.notExistingSampleFile(user)
      val project    = projects.existingProject(user)
      sflp.create(sampleFile.uuid, project.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "not be able to schedule deletion of not existing link" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.notExistingSampleFileLink(sampleFile, project)
      sflp.scheduleDelete(link.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to schedule and cancel deletion of existing sample file link" taggedAs ModelsTestTag in {
      val p          = events.probe[SampleFileLinkProviderEvent]
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)
      for {
        scheduled           <- sflp.scheduleDelete(link.uuid)
        _                   <- Future.successful(p.expectMsgType[SampleFileLinkProviderEvents.SampleFileLinkDeleteScheduled])
        check               <- scheduled should be(true)
        scheduledLink       <- sflp.get(link.uuid)
        _                   <- scheduledLink should not be empty
        _                   <- scheduledLink.get.deleteOn should not be empty
        sampleAfterSchedule <- sfp.get(sampleFile.uuid)
        _                   <- sampleAfterSchedule should not be empty
        _                   <- sampleAfterSchedule.get.isDangling should be(true)
        cancelled           <- sflp.cancelScheduledDelete(link.uuid)
        _                   <- Future.successful(p.expectMsgType[SampleFileLinkProviderEvents.SampleFileLinkDeleteCancelled])
        _                   <- cancelled should be(true)
        cancelledLink       <- sflp.get(link.uuid)
        _                   <- cancelledLink should not be empty
        _                   <- cancelledLink.get.deleteOn should be(empty)
        sampleAfterCancel   <- sfp.get(sampleFile.uuid)
        _                   <- sampleAfterCancel should not be empty
        _                   <- sampleAfterCancel.get.isDangling should be(false)
      } yield check
    }

    "not be able to delete not existing sample file link" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.notExistingSampleFileLink(sampleFile, project)
      sflp.delete(link.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to delete sample file link" taggedAs ModelsTestTag in {
      val el         = events.probe[SampleFileLinkProviderEvent]
      val ep         = events.probe[SampleFileProviderEvent]
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      val project    = projects.existingProject(user)
      val link       = sampleFileLinks.existingSampleFileLink(sampleFile, project)

      for {
        delete                <- sflp.delete(link.uuid)
        _                     <- Future.successful(el.expectMsgType[SampleFileLinkProviderEvents.SampleFileLinkDeleted])
        _                     <- Future.successful(ep.expectMsgType[SampleFileProviderEvents.SampleFileDeleted])
        deletedLinkInDB       <- sflp.get(link.uuid)
        _                     <- deletedLinkInDB should be(empty)
        deletedSampleFileInDB <- sfp.get(link.sampleFile.uuid)
        _                     <- deletedSampleFileInDB should be(empty)
        check                 <- delete should be(true)
      } yield check
    }

  }

}
