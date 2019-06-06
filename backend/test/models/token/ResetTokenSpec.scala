package models.token

import models.SQLDatabaseTestTag

class ResetTokenSpec extends BaseTokenTestSpec {

  "ResetTokenProvider" should {

    "have proper table name" taggedAs SQLDatabaseTestTag in {
      rtp.getTable.baseTableRow.tableName shouldEqual ResetTokenTable.TABLE_NAME
    }

  }
}
