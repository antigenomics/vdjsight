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
      val tokens = for {
        token1 <- vtp.create(users.notVerifiedUser.uuid)
        token2 <- vtp.create(users.notVerifiedUser.uuid)
      } yield (token1, token2)

      tokens.map {
        case (t1, t2) => t1 shouldEqual t2
      }
    }

    "get not empty list on not empty table" taggedAs SQLDatabaseTestTag in {
      for {
        _ <- vtp.create(users.notVerifiedUser.uuid)
        s <- vtp.all
      } yield s should not be empty
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
