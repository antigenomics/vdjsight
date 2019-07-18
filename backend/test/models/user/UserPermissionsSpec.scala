package models.user

import models.ModelsTestTag
import specs.BaseTestSpecWithDatabaseAndApplication
import traits.{DatabaseProviders, DatabaseUsers, EffectsStream}

import scala.concurrent.Future
import scala.concurrent.duration._
import scala.language.{postfixOps, reflectiveCalls}

class UserPermissionsSpec extends BaseTestSpecWithDatabaseAndApplication with DatabaseProviders with DatabaseUsers with EffectsStream {

  "UserPermissions" should {

    "have proper table name" taggedAs ModelsTestTag in {
      upp.table.baseTableRow.tableName shouldEqual UserPermissionsTable.TABLE_NAME
    }

    "not be able to find permissions for not existing user" taggedAs ModelsTestTag in {
      for {
        notExisting <- upp.findForUser(users.notExistingUser.uuid)
      } yield notExisting should be(empty)
    }

    "not be able to create permissions for not existing user" taggedAs ModelsTestTag in {
      upp.create(users.notExistingUser.uuid).map(_ => w.dismiss())
      assertThrows[Exception] {
        w.await()
      }
    }

    "be able to find permissions for existing user" taggedAs ModelsTestTag in {
      for {
        notVerified <- upp.findForUser(users.notVerifiedUser.uuid)
        verified    <- upp.findForUser(users.notVerifiedUser.uuid)
        _           <- notVerified should not be empty
        check       <- verified should not be empty
      } yield check
    }

    "not be able to create multiple permissions for one user" taggedAs ModelsTestTag in {
      val probe = events.probe[UserPermissionsProviderEvent]
      for {
        permissions1 <- upp.create(users.notVerifiedUser.uuid)
        permissions2 <- upp.create(users.notVerifiedUser.uuid)
        check        <- permissions1 shouldEqual permissions2
        _            <- Future(probe.expectNoMessage(100 milliseconds))
      } yield check
    }

    "be automatically created with user" taggedAs ModelsTestTag in {
      val p = events.probe[UserPermissionsProviderEvent]
      val c = users.notExistingUser.credentials
      for {
        newUser     <- up.create(c.login, c.email, c.password)
        _           <- Future(p.expectMsgType[UserPermissionsProviderEvents.UserPermissionsCreated])
        permissions <- upp.findForUser(newUser.uuid)
        _           <- permissions should not be empty
        _           <- permissions.get._1.userID shouldEqual newUser.uuid
        check       <- permissions.get._2.uuid shouldEqual newUser.uuid
      } yield check
    }

  }

}
