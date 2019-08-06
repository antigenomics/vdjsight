package utils

import java.sql.Timestamp
import java.time.Duration

object TimeUtils {

  def getExpiredAt(keep: Duration): Timestamp = new Timestamp(new java.util.Date().getTime + keep.getSeconds * 1000)

  def getCurrentTimestamp: Timestamp = new Timestamp(new java.util.Date().getTime)

  def timing[R, T](name: String)(block: () => T): T = {
    val start = System.currentTimeMillis
    println(s"before-$name")
    val result = block()
    val end    = System.currentTimeMillis()
    println(s"after-$name [ ${end - start} ms]")
    result
  }

}
