const { StatusCodes } = require('http-status-codes')
const { addAccount: addAccountService,
  deposit: depositService,
  withdraw: withdrawService,
  transfer: transferService,
  getAccounts: getAccountsService,
  accountTransactions: accountTransactionService,
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

const getAccounts = async (req, res, next) => {
  try {
    // const { bankID } = req.params
    const query = req.query
    const queryparams = {}

    if (query.bankID) {
      queryparams.bank_id = query.bankID
    }

    if (query.customerID) {
      queryparams.customer_id = query.customerID
    }

    if (query.accountID) {
      queryparams.id = query.accountID
    }

    const account = new Account()
    const accounts = await getAccountsService(account, queryparams)

    res.status(StatusCodes.OK).json(accounts)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const deposit = async (req, res, next) => {
  try {
    const { amount, bankID } = req.body
    const fromAccountID = req.params.accountID

    const accountTransaction = new AccountTransaction(amount, fromAccountID, null, "Deposit", bankID)

    await depositService(accountTransaction)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const withdraw = async (req, res, next) => {
  try {
    const { amount, bankID } = req.body
    const fromAccountID = req.params.accountID

    const accountTransaction = new AccountTransaction(amount, fromAccountID, null, "Withdraw", bankID)

    await withdrawService(accountTransaction)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const transfer = async (req, res, next) => {
  try {
    const { amount, toAccountID, bankID } = req.body
    const fromAccountID = req.params.accountID
    const accountTransactionOne = new AccountTransaction(amount, fromAccountID, toAccountID, "Deposit", bankID)
    const accountTransactionTwo = new AccountTransaction(amount, toAccountID, fromAccountID, "Withdraw", bankID)

    await transferService(accountTransactionOne, accountTransactionTwo)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.log(error);
    next(error)
  }
}

const accountTransactions = async (req, res, next) => {
  try {
    const accountID = req.params.accountID
    const queryparams = req.query
    const { limit, offset } = req.query

    if (queryparams.limit) {
      delete queryparams.limit
    }

    if (queryparams.offset) {
      delete queryparams.offset
    }

    const { count, accountTransactions } = await accountTransactionService(accountID, { limit, offset }, queryparams)

    res.header("X-Total-Count", count)
    res.status(StatusCodes.OK).json(accountTransactions)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { addAccount, getAccounts, deposit, withdraw, transfer, accountTransactions }