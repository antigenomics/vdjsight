package models.sample

import models.ModelsTestTag
import specs.BaseTestSpecWithDatabaseAndApplication
import traits._

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.{postfixOps, reflectiveCalls}

class SampleFileSpec extends BaseTestSpecWithDatabaseAndApplication with DatabaseProviders with DatabaseUsers with DatabaseSampleFiles with EffectsStream {

  "SampleFileProvider" should {

    "have proper table name" taggedAs ModelsTestTag in {
      sfp.table.baseTableRow.tableName shouldEqual SampleFileTable.TABLE_NAME
    }

    "not be able to find not existing sample" taggedAs ModelsTestTag in {
      val user       = users.notExistingUser
      val sampleFile = sampleFiles.notExistingSampleFile(user)
      for {
        notExisting <- sfp.get(sampleFile.uuid)
      } yield notExisting should be(empty)
    }

    "be able to find existing sample" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      for {
        existing <- sfp.get(sampleFile.uuid)
        _        <- existing should not be empty
        _        <- existing.get.uuid shouldEqual sampleFile.uuid
        _        <- existing.get.name shouldEqual sampleFile.name
        check    <- existing.get.software shouldEqual sampleFile.software
      } yield check
    }

    "be able to find samples for owner" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      for {
        existing <- sfp.get(sampleFile.uuid)
        _        <- existing should not be empty
        owners   <- sfp.findForOwner(user.uuid)
        check    <- owners should contain(existing.get)
      } yield check
    }

    "be able to return sample with owner" taggedAs ModelsTestTag in {
      val user       = users.verifiedUser
      val sampleFile = sampleFiles.existingSampleFile(user)
      for {
        existing  <- sfp.get(sampleFile.uuid)
        _         <- existing should not be empty
        withOwner <- sfp.getWithOwner(existing.get.uuid)
        _         <- withOwner should not be empty
        _         <- withOwner.get._1.uuid shouldEqual existing.get.uuid
        _         <- withOwner.get._1.ownerID shouldEqual withOwner.get._2.uuid
        check     <- withOwner.get._2.uuid shouldEqual user.uuid
      } yield check
    }

    "not be able to create new sample for not existing user" taggedAs ModelsTestTag in {
      val p = events.probe[SampleFileProviderEvent]
      sfp.create(users.notExistingUser.uuid, "new-sample", "some-software", "some-species", "some-gene", 1, "txt", "h").map(_ => w.dismiss())
      assertThrows[Exception] {
        p.expectNoMessage(100 milliseconds)
        w.await()
      }
    }

    "be able to create new sample" taggedAs ModelsTestTag in {
      val p = events.probe[SampleFileProviderEvent]
      for {
        created <- sfp.create(
                    users.verifiedUser.uuid,
                    "name",
                    "software",
                    "species",
                    "gene",
                    1,
                    "txt",
                    "h",
                    overrideConfiguration = Some(SampleFilesConfiguration("path", 10))
                  )
        _     <- Future.successful(p.expectMsgType[SampleFileProviderEvents.SampleFileCreated])
        _     <- created.ownerID shouldEqual users.verifiedUser.uuid
        _     <- created.name shouldEqual "name"
        _     <- created.software shouldEqual "software"
        _     <- created.size shouldEqual 1
        _     <- created.hash shouldEqual "h"
        _     <- created.folder should include("path")
        check <- created.isDangling should be(false)
      } yield check
    }

    "not be able to update not existing project" taggedAs ModelsTestTag in {
      val p = events.probe[SampleFileProviderEvent]
      sfp.update(sampleFiles.notExistingSampleFile(users.verifiedUser).uuid, "new-name", "new-software", "new-species", "new-gene").map(_ => w.dismiss())
      assertThrows[Exception] {
        p.expectNoMessage(100 milliseconds)
        w.await()
      }
    }

    "be able to update existing sample" taggedAs ModelsTestTag in {
      val p = events.probe[SampleFileProviderEvent]
      for {
        sample  <- sfp.update(sampleFiles.existingSampleFile(users.verifiedUser).uuid, "new-name-1", "new-software-1", "new-species-1", "new-gene-1")
        _       <- Future.successful(p.expectMsgType[SampleFileProviderEvents.SampleFileUpdated])
        _       <- sample.uuid shouldEqual sampleFiles.existingSampleFile(users.verifiedUser).uuid
        updated <- sfp.get(sampleFiles.existingSampleFile(users.verifiedUser).uuid)
        _       <- updated should not be empty
        _       <- updated.get.name shouldEqual "new-name-1"
        _       <- updated.get.software shouldEqual "new-software-1"
        _       <- updated.get.species shouldEqual "new-species-1"
        check   <- updated.get.gene shouldEqual "new-gene-1"
      } yield check
    }

    "not be able to delete not existing sample" taggedAs ModelsTestTag in {
      val p = events.probe[SampleFileProviderEvent]
      sfp.delete(sampleFiles.notExistingSampleFile(users.verifiedUser).uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        p.expectNoMessage(100 milliseconds)
        w.await()
      }
    }

    "be able to delete existing project" taggedAs ModelsTestTag in {
      val p = events.probe[SampleFileProviderEvent]
      for {
        deleted     <- sfp.delete(sampleFiles.existingSampleFile(users.verifiedUser).uuid)
        _           <- Future.successful(p.expectMsgType[SampleFileProviderEvents.SampleFileDeleted])
        _           <- deleted.uuid shouldEqual sampleFiles.existingSampleFile(users.verifiedUser).uuid
        deletedInDB <- sfp.get(sampleFiles.existingSampleFile(users.verifiedUser).uuid)
        check       <- deletedInDB should be(empty)
      } yield check
    }

  }

}
