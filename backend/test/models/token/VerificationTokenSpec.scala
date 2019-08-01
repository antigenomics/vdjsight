package models.token

import models.ModelsTestTag
import org.scalatest.Assertions
import specs.BaseTestSpecWithDatabaseAndApplication
import traits.{DatabaseProviders, DatabaseUsers, EffectsStream}

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.{postfixOps, reflectiveCalls}
import scala.util.{Failure, Success}

class VerificationTokenSpec extends BaseTestSpecWithDatabaseAndApplication with DatabaseProviders with DatabaseUsers with EffectsStream {

  "VerificationMethod" should {

    "correctly accept valid method string values" in {
      VerificationMethod.values.unsorted.map { value =>
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

    "have proper table name" taggedAs ModelsTestTag in {
      vtp.table.baseTableRow.tableName shouldEqual VerificationTokenTable.TABLE_NAME
    }

    "list empty list on empty table" taggedAs ModelsTestTag in {
      vtp.all.map {
        _ should be(empty)
      }
    }

    "not be able to create verification token for not existing user" taggedAs ModelsTestTag in {
      vtp.create(users.notExistingUser.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to create verification token for not verified user" taggedAs ModelsTestTag in {
      val probe = events.probe[VerificationTokenProviderEvent]
      vtp.create(users.notVerifiedUser.uuid).transform {
        case Success(_) =>
          probe.expectMsgType[VerificationTokenProviderEvents.TokenCreated]
          Success(Assertions.succeed)
        case Failure(_) => Assertions.fail
      }
    }

    "not create many tokens for one user and return the single one" taggedAs ModelsTestTag in {
      val probe = events.probe[VerificationTokenProviderEvent]
      for {
        token1 <- vtp.create(users.notVerifiedUser.uuid)
        token2 <- vtp.create(users.notVerifiedUser.uuid)
        check  <- token1 shouldEqual token2
        _      <- Future(probe.expectNoMessage(100 milliseconds))
      } yield check
    }

    "list not empty list on not empty table" taggedAs ModelsTestTag in {
      for {
        _ <- vtp.create(users.notVerifiedUser.uuid)
        s <- vtp.all
      } yield s should not be empty
    }

    "be able to find proper token associated user" taggedAs ModelsTestTag in {
      for {
        token <- vtp.create(users.notVerifiedUser.uuid)
        uwt   <- vtp.getWithUser(token.token)
        found <- vtp.findForUser(uwt.get._2.uuid)
        _     <- uwt should not be empty
        _     <- uwt.get._1.token shouldEqual token.token
        _     <- uwt.get._2.uuid shouldEqual users.notVerifiedUser.uuid
        _     <- uwt.get._2.login shouldEqual users.notVerifiedUser.credentials.login
        _     <- uwt.get._2.email shouldEqual users.notVerifiedUser.credentials.email
        check <- found.map(_.token) shouldEqual Set(token.token)
      } yield check
    }

    "be able to delete verification token" taggedAs ModelsTestTag in {
      val probe = events.probe[VerificationTokenProviderEvent]
      for {
        createdToken <- vtp.create(users.notVerifiedUser.uuid)
        _            <- vtp.delete(createdToken.token)
        deletedToken <- vtp.get(createdToken.token)
        _            <- Future(probe.expectMsgType[VerificationTokenProviderEvents.TokenDeleted])
      } yield deletedToken should be(empty)
    }

  }
}
