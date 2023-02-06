require("dotenv").config()
const jwt = require("jsonwebtoken")
const BankingAppError = require("../errors")

class JwtToken {
  constructor(user) {
    this.userID = user.id
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
  }

  createPayload() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      userID: this.userID,
      email: this.email,
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
      let decode = jwt.verify(cookie['token'], process.env.JWT_SECRET)
      console.log(decode);
      next()
    } catch (error) {
      console.error(error);
      throw BankingAppError.UnauthorizedError("Session expired. Please login again")
    }
  }

}

module.exports = JwtToken