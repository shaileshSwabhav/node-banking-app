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
    return jwt.sign(this.createPayload(), process.env.JWT_SECRET, {
      expiresIn: '1d'
    })
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