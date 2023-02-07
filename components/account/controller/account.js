const { StatusCodes } = require('http-status-codes')
const { addAccount: addAccountService, deposit: depositService, withdraw: withdrawService } = require("../service/account")
const { Account } = require("../../../view/account/account")
const { AccountTransaction } = require('../../../view/account/account-transaction')

const addAccount = async (req, res, next) => {
  try {
    const { accountName, bankID, customerID, balance } = req.body
    const account = new Account(accountName, bankID, customerID, balance)
    // account.initializeAccount(accountName, bankID, customerID, balance)

    if (balance < 1000) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Minimum Balance to create account is 1000." })
      return
    }

    await addAccountService(account)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const deposit = async (req, res, next) => {
  try {
    const { amount } = req.body
    const accountID = req.params.accountID

    const accountTransaction = new AccountTransaction(accountID, amount)

    await depositService(accountTransaction)
    res.status(StatusCodes.CREATED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const withdraw = async (req, res, next) => {
  try {
    const { amount } = req.body
    const accountID = req.params.accountID

    const accountTransaction = new AccountTransaction(accountID, amount)

    await withdrawService(accountTransaction)
    res.status(StatusCodes.CREATED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { addAccount, deposit, withdraw }