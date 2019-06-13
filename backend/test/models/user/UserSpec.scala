package models.user

import models.ModelsTestTag
import org.scalatest.Assertion
import specs.BaseTestSpecWithDatabaseAndApplication
import traits.{DatabaseProviders, DatabaseUsers}

import scala.concurrent.Future
import scala.language.reflectiveCalls

class UserSpec extends BaseTestSpecWithDatabaseAndApplication with DatabaseProviders with DatabaseUsers {

  "UserProvider" should {

    "have proper table name" taggedAs ModelsTestTag in {
      up.table.baseTableRow.tableName shouldEqual UserTable.TABLE_NAME
    }

    "not be able to find not existing user" taggedAs ModelsTestTag in {
      for {
        notExisting <- up.get(users.notExistingUser.uuid)
      } yield notExisting should be(empty)
    }

    "be able to find not verified user" taggedAs ModelsTestTag in {
      for {
        notVerified <- up.get(users.notVerifiedUser.uuid)
        _           <- notVerified should not be empty
        _           <- notVerified.get.uuid shouldEqual users.notVerifiedUser.uuid
        _           <- notVerified.get.login shouldEqual users.notVerifiedUser.credentials.login
        check       <- notVerified.get.email shouldEqual users.notVerifiedUser.credentials.email
      } yield check
    }

    "be able to find verified user" taggedAs ModelsTestTag in {
      for {
        verified <- up.get(users.verifiedUser.uuid)
        _        <- verified should not be empty
        _        <- verified.get.uuid shouldEqual users.verifiedUser.uuid
        _        <- verified.get.login shouldEqual users.verifiedUser.credentials.login
        check    <- verified.get.email shouldEqual users.verifiedUser.credentials.email
      } yield check
    }

    "be able to find user by login" taggedAs ModelsTestTag in {
      for {
        user  <- up.getByLogin(users.verifiedUser.credentials.login)
        _     <- user should not be empty
        _     <- user.get.uuid shouldEqual users.verifiedUser.uuid
        _     <- user.get.login shouldEqual users.verifiedUser.credentials.login
        check <- user.get.email shouldEqual users.verifiedUser.credentials.email
      } yield check
    }

    "be able to find user by email" taggedAs ModelsTestTag in {
      for {
        user  <- up.getByEmail(users.verifiedUser.credentials.email)
        _     <- user should not be empty
        _     <- user.get.uuid shouldEqual users.verifiedUser.uuid
        _     <- user.get.login shouldEqual users.verifiedUser.credentials.login
        check <- user.get.email shouldEqual users.verifiedUser.credentials.email
      } yield check
    }

    "be able to create new user" taggedAs ModelsTestTag in {
      val c = users.notExistingUser.credentials
      for {
        newUserUUID <- up.create(c.login, c.email, c.password)
        newUser     <- up.get(newUserUUID)
        _           <- newUser should not be empty
        _           <- newUser.get.login shouldEqual c.login
        _           <- newUser.get.verified shouldEqual false
        check       <- newUser.get.email shouldEqual c.email
      } yield check
    }

    "be able to verify users" taggedAs ModelsTestTag in {
      val u = users.notVerifiedUser
      for {
        verificationToken <- vtp.create(u.uuid)
        verifiedUser      <- up.verify(verificationToken)
        _                 <- verifiedUser should not be empty
        _                 <- verifiedUser.get.login shouldEqual u.credentials.login
        _                 <- verifiedUser.get.email shouldEqual u.credentials.email
        check             <- verifiedUser.get.verified shouldEqual true
      } yield check
    }

    "be able to reset users" taggedAs ModelsTestTag in {
      def resetUser(user: TestUser): Future[Assertion] = {
        for {
          resetTokenForTestUser <- rtp.create(user.uuid)
          testInDBBeforeReset   <- up.get(user.uuid)
          resetTestUser         <- up.reset(resetTokenForTestUser, user.credentials.password + "_")
          _                     <- testInDBBeforeReset should not be empty
          _                     <- resetTestUser should not be empty
          _                     <- testInDBBeforeReset.get.uuid shouldEqual resetTestUser.get.uuid
          _                     <- testInDBBeforeReset.get.email shouldEqual resetTestUser.get.email
          _                     <- testInDBBeforeReset.get.login shouldEqual resetTestUser.get.login
          _                     <- testInDBBeforeReset.get.password shouldNot equal(resetTestUser.get.password)
          check                 <- resetTestUser.get.verified shouldEqual true
        } yield check
      }
      Seq(
        resetUser(users.verifiedUser),
        resetUser(users.notVerifiedUser)
      ).assertAll
    }

    "be able to delete users" taggedAs ModelsTestTag in {
      val u = users.verifiedUser
      for {
        _           <- up.delete(u.uuid)
        deletedUser <- up.get(u.uuid)
      } yield deletedUser should be(empty)
    }

  }

}
