const { StatusCodes } = require('http-status-codes')
const BankingAppError = require('../errors/custom-error')

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof BankingAppError) {
    // console.log(err);
    return res.status(err.statusCode).json({ error: err.message })
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = errorHandlerMiddleware