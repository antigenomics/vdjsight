package utils.secure

import com.lambdaworks.crypto.SCryptUtil

object SecureHash {

  def create(password: String): String = SCryptUtil.scrypt(password, 16384, 16, 2)

  def validate(password: String, hashed: String): Boolean = SCryptUtil.check(password, hashed)

}
