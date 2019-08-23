package utils

object StreamUtils {

  trait StreamLike[T] {
    def hasNext: Boolean
    def next: T
  }

  def makeLazyList[T](from: StreamLike[T]): LazyList[T] = {
    if (from.hasNext) {
      from.next #:: makeLazyList(from)
    } else {
      LazyList.empty
    }
  }

}
