const { StatusCodes } = require("http-status-codes")
const BankingAppError = require("./custom-error")

class BadRequestError extends BankingAppError {
  constructor(errorMessage) {
    super(errorMessage)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

module.exports = BadRequestError