const { StatusCodes } = require('http-status-codes')
const { addAccount: addAccountService,
  deposit: depositService,
  withdraw: withdrawService,
  transfer: transferService,
} = require("../service/account")
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
    const toAccountID = req.params.accountID

    const accountTransaction = new AccountTransaction(amount, null, toAccountID)

    await depositService(accountTransaction)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const withdraw = async (req, res, next) => {
  try {
    const { amount } = req.body
    const fromAccountID = req.params.accountID

    const accountTransaction = new AccountTransaction(amount, fromAccountID, null)

    await withdrawService(accountTransaction)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const transfer = async (req, res, next) => {
  try {
    const { amount, toAccountID } = req.body
    const fromAccountID = req.params.accountID
    const accountTransaction = new AccountTransaction(amount, fromAccountID, toAccountID)

    await transferService(accountTransaction)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.log(error);
    next(error)
  }
}

module.exports = { addAccount, deposit, withdraw, transfer }