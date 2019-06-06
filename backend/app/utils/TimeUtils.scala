package utils

import java.sql.Timestamp
import java.time.Duration

object TimeUtils {

  def getExpiredAt(keep: Duration): Timestamp = new Timestamp(new java.util.Date().getTime + keep.getSeconds * 1000)

  def getCurrentTimestamp: Timestamp = new Timestamp(new java.util.Date().getTime)

}
