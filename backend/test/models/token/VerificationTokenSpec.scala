package models.token

import models.SQLDatabaseTestTag

import scala.concurrent.Future
import scala.language.reflectiveCalls

class VerificationTokenSpec extends BaseTokenTestSpec {

  "VerificationMethod" should {

    "correctly accept valid method string values" in {
      VerificationMethod.values.map { value =>
        Future.successful(VerificationMethod.convert(value.toString) shouldEqual value)
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
      vtp.getTable.baseTableRow.tableName shouldEqual VerificationTokenTable.TABLE_NAME
    }

    "not be able to create verification token for not existing user" taggedAs SQLDatabaseTestTag in {
      vtp.create(fixtures.nonExistingUser.credentials.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

  }
}
