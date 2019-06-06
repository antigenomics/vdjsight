package models.token

import models.SQLDatabaseTestTag
import org.scalatest.Assertions

import scala.concurrent.Future
import scala.language.reflectiveCalls
import scala.util.{Failure, Success}

class ResetTokenSpec extends BaseTokenTestSpec {

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
      rtp.create(fixtures.notExistingUser.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to create reset token for not verified user" taggedAs SQLDatabaseTestTag in {
      rtp.create(fixtures.notVerifiedUser.uuid).transform {
        case Success(_) => Success(Assertions.succeed)
        case Failure(_) => Assertions.fail
      }
    }

    "not create many tokens for one user and return the single one" taggedAs SQLDatabaseTestTag in {
      val tokens = for {
        token1 <- rtp.create(fixtures.notVerifiedUser.uuid)
        token2 <- rtp.create(fixtures.notVerifiedUser.uuid)
      } yield (token1, token2)

      tokens.map {
        case (t1, t2) => t1 shouldEqual t2
      }
    }

    "get not empty list on not empty table" taggedAs SQLDatabaseTestTag in {
      for {
        _ <- rtp.create(fixtures.notVerifiedUser.uuid)
        s <- rtp.all
      } yield s should not be empty
    }

    "be able to delete verification token" taggedAs SQLDatabaseTestTag in {
      for {
        createdToken <- rtp.create(fixtures.notVerifiedUser.uuid)
        _            <- rtp.delete(createdToken)
        deletedToken <- rtp.get(createdToken)
      } yield deletedToken should be(empty)
    }

  }
}
