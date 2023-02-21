require("dotenv").config()
const jwt = require("jsonwebtoken")
const BankingAppError = require("../errors")

class JwtToken {
  constructor(id, username, roleName) {
    this.credentialID = id
    this.username = username
    this.roleName = roleName
  }

  createPayload() {
    return {
      username: this.username,
      credentialID: this.credentialID,
      roleName: this.roleName
    }
  }

  generateToken() {
    const token = jwt.sign(JSON.stringify(this), process.env.JWT_SECRET.toString())
    return token
  }

  static authenticateCookie(req, res, next) {
    let cookie = req.cookies

    if (!cookie) {
      throw new BankingAppError.UnauthorizedError("Session cookie not found. Please login")
    }

    try {
      let decode = jwt.verify(cookie['authorization'], process.env.JWT_SECRET)
      console.log(decode);
      next()
    } catch (error) {
      console.error(error);
      throw BankingAppError.UnauthorizedError("Session expired. Please login again")
    }
  }

}

module.exports = JwtToken