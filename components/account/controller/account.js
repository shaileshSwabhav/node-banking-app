const { StatusCodes } = require('http-status-codes')
const { addAccount: addAccountService } = require("../service/account")
const { Account } = require("../../../view/account/account")

const addAccount = async (req, res, next) => {
  try {
    const { accountName, bankID, customerID, balance } = req.body
    const account = new Account(accountName, bankID, customerID, balance)

    if (balance == 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Minimum Balance to create account is 500." })
    }

    await addAccountService(account)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { addAccount }