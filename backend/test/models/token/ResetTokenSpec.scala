package models.token

import models.{DatabaseProviderTestSpec, SQLDatabaseTestTag}
import org.scalatest.Assertions
import traits.DatabaseUsersTestTrait

import scala.concurrent.Future
import scala.language.reflectiveCalls
import scala.util.{Failure, Success}

class ResetTokenSpec extends DatabaseProviderTestSpec with DatabaseUsersTestTrait {

  "ResetMethod" should {

    "correctly accept valid method string values" in {
      ResetMethod.values.map { value =>
        Future.successful(
          ResetMethod.convert(value.toString) shouldEqual value
        )
      }.assertAll
    }

    "throw an exception on invalid method string value" in {
      assertThrows[RuntimeException] {
        ResetMethod.convert("invalid")
      }
    }

  }

  "ResetTokenProvider" should {

    "have proper table name" taggedAs SQLDatabaseTestTag in {
      rtp.table.baseTableRow.tableName shouldEqual ResetTokenTable.TABLE_NAME
    }

    "get empty list on empty table" taggedAs SQLDatabaseTestTag in {
      rtp.all.map {
        _ should be(empty)
      }
    }

    "not be able to create reset token for not existing user" taggedAs SQLDatabaseTestTag in {
      rtp.create(users.notExistingUser.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to create reset token for not verified user" taggedAs SQLDatabaseTestTag in {
      rtp.create(users.notVerifiedUser.uuid).transform {
        case Success(_) => Success(Assertions.succeed)
        case Failure(_) => Assertions.fail
      }
    }

    "be able to create reset token for verified user" taggedAs SQLDatabaseTestTag in {
      rtp.create(users.verifiedUser.uuid).transform {
        case Success(_) => Success(Assertions.succeed)
        case Failure(_) => Assertions.fail
      }
    }

    "not create many tokens for one user and return the single one" taggedAs SQLDatabaseTestTag in {
      val tokens = for {
        token1 <- rtp.create(users.notVerifiedUser.uuid)
        token2 <- rtp.create(users.notVerifiedUser.uuid)
      } yield (token1, token2)

      tokens.map {
        case (t1, t2) => t1 shouldEqual t2
      }
    }

    "get not empty list on not empty table" taggedAs SQLDatabaseTestTag in {
      for {
        _ <- rtp.create(users.notVerifiedUser.uuid)
        s <- rtp.all
      } yield s should not be empty
    }

    "be able to delete verification token" taggedAs SQLDatabaseTestTag in {
      for {
        createdToken <- rtp.create(users.notVerifiedUser.uuid)
        _            <- rtp.delete(createdToken)
        deletedToken <- rtp.get(createdToken)
      } yield deletedToken should be(empty)
    }

  }
}
