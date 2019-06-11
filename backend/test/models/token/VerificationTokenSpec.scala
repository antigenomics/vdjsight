package models.token

import models.{DatabaseProviderTestSpec, SQLDatabaseTestTag}
import org.scalatest.Assertions
import traits.DatabaseUsersTestTrait

import scala.concurrent.Future
import scala.language.reflectiveCalls
import scala.util.{Failure, Success}

class VerificationTokenSpec extends DatabaseProviderTestSpec with DatabaseUsersTestTrait {

  "VerificationMethod" should {

    "correctly accept valid method string values" in {
      VerificationMethod.values.map { value =>
        Future.successful(
          VerificationMethod.convert(value.toString) shouldEqual value
        )
      }.assertAll
    }

    "throw an exception on invalid method string value" in {
      assertThrows[RuntimeException] {
        VerificationMethod.convert("invalid")
      }
    }

  }

  "VerificationTokenProvider" should {

    "have proper table name" taggedAs SQLDatabaseTestTag in {
      vtp.table.baseTableRow.tableName shouldEqual VerificationTokenTable.TABLE_NAME
    }

    "get empty list on empty table" taggedAs SQLDatabaseTestTag in {
      vtp.all.map {
        _ should be(empty)
      }
    }

    "not be able to create verification token for not existing user" taggedAs SQLDatabaseTestTag in {
      vtp.create(users.notExistingUser.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to create verification token for not verified user" taggedAs SQLDatabaseTestTag in {
      vtp.create(users.notVerifiedUser.uuid).transform {
        case Success(_) => Success(Assertions.succeed)
        case Failure(_) => Assertions.fail
      }
    }

    "not create many tokens for one user and return the single one" taggedAs SQLDatabaseTestTag in {
      for {
        token1 <- vtp.create(users.notVerifiedUser.uuid)
        token2 <- vtp.create(users.notVerifiedUser.uuid)
        check  <- token1 shouldEqual token2
      } yield check
    }

    "get not empty list on not empty table" taggedAs SQLDatabaseTestTag in {
      for {
        _ <- vtp.create(users.notVerifiedUser.uuid)
        s <- vtp.all
      } yield s should not be empty
    }

    "be able to find proper token associated user" taggedAs SQLDatabaseTestTag in {
      for {
        token <- vtp.create(users.notVerifiedUser.uuid)
        uwt   <- vtp.getWithUser(token)
        found <- vtp.findForUser(uwt.get._2.uuid)
        _     <- uwt should not be empty
        _     <- uwt.get._1.token shouldEqual token
        _     <- uwt.get._2.uuid shouldEqual users.notVerifiedUser.uuid
        _     <- uwt.get._2.login shouldEqual users.notVerifiedUser.credentials.login
        _     <- uwt.get._2.email shouldEqual users.notVerifiedUser.credentials.email
        _     <- found should not be empty
        check <- found.get.token shouldEqual token
      } yield check
    }

    "be able to delete verification token" taggedAs SQLDatabaseTestTag in {
      for {
        createdToken <- vtp.create(users.notVerifiedUser.uuid)
        _            <- vtp.delete(createdToken)
        deletedToken <- vtp.get(createdToken)
      } yield deletedToken should be(empty)
    }

  }
}
