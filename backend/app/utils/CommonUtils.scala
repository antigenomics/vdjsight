package utils

object CommonUtils {

  def safeBetween[T](value: T, range: (T, T))(implicit ev: Ordering[T]): T = {
    if (ev.lt(value, range._1)) {
      range._1
    } else if (ev.gt(value, range._2)) {
      range._2
    } else {
      value
    }
  }

}
