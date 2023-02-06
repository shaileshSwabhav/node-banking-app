const { StatusCodes } = require("http-status-codes")
const BankingAppError = require("./custom-error");

class NotFoundError extends BankingAppError {
  constructor(errorMessage) {
    super(errorMessage)
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

module.exports = NotFoundError