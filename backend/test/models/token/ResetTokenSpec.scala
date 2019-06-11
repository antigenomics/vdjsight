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
      for {
        token1 <- rtp.create(users.notVerifiedUser.uuid)
        token2 <- rtp.create(users.notVerifiedUser.uuid)
        check  <- token1 shouldEqual token2
      } yield check
    }

    "get not empty list on not empty table" taggedAs SQLDatabaseTestTag in {
      for {
        _ <- rtp.create(users.notVerifiedUser.uuid)
        s <- rtp.all
      } yield s should not be empty
    }

    "be able to find proper token associated user" taggedAs SQLDatabaseTestTag in {
      for {
        token <- rtp.create(users.notVerifiedUser.uuid)
        uwt   <- rtp.getWithUser(token)
        found <- rtp.findForUser(uwt.get._2.uuid)
        _     <- uwt should not be empty
        _     <- uwt.get._1.token shouldEqual token
        _     <- uwt.get._2.uuid shouldEqual users.notVerifiedUser.uuid
        _     <- uwt.get._2.login shouldEqual users.notVerifiedUser.credentials.login
        _     <- uwt.get._2.email shouldEqual users.notVerifiedUser.credentials.email
        _     <- found should not be empty
        check <- found.get.token shouldEqual token
      } yield check
    }

    "be able to delete reset token" taggedAs SQLDatabaseTestTag in {
      for {
        createdToken <- rtp.create(users.notVerifiedUser.uuid)
        _            <- rtp.delete(createdToken)
        deletedToken <- rtp.get(createdToken)
      } yield deletedToken should be(empty)
    }

  }
}
