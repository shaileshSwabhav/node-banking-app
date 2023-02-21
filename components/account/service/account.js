const BankingAppError = require("../../../errors")
const db = require("../../../models")
const { AccountTransaction } = require("../../../view/account/account-transaction")

const addAccount = async (account) => {
  try {
    // managed transaction.
    const result = await db.sequelize.transaction(async (transaction) => {

      // validations
      await account.doesBankExist()
      await account.doesCustomerExist(account.customerID)
      await account.doesAccountExistForBank()

      // add
      await account.addAccount(transaction)
    })
    console.log(result);
  } catch (error) {
    throw new BankingAppError.BadRequestError(error)
  }
}

const getAccounts = async (account, queryparams) => {
  const transaction = await db.sequelize.transaction()
  try {
    console.log(queryparams);
    const accounts = await account.getAccounts(transaction, queryparams)

    await transaction.commit()
    return accounts
  } catch (error) {
    console.error(error);
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const deposit = async (accountTransaction) => {
  const transaction = await db.sequelize.transaction()
  try {
    await accountTransaction.doesAccountExist(accountTransaction.toAccountID)
    // await accountTransaction.deposit(transaction)
    console.log(accountTransaction);
    const account = await accountTransaction.getAccount(transaction, accountTransaction.toAccountID)
    const customer = await accountTransaction.getCustomer(account.customerID, transaction)

    await accountTransaction.updateCustomerBalance(customer.id, parseFloat(customer.balance) + parseFloat(accountTransaction.amount), transaction)
    await accountTransaction.updateAccountBalance(parseFloat(account.balance) + parseFloat(accountTransaction.amount), account.id, transaction)

    await accountTransaction.addAccountTransaction(transaction)

    await transaction.commit()
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const withdraw = async (accountTransaction) => {
  const transaction = await db.sequelize.transaction()
  try {

    await accountTransaction.doesAccountExist()
    const account = await accountTransaction.getAccount(transaction)

    if (account.balance < accountTransaction.amount) {
      throw new BankingAppError.BadRequestError("Withdrawing amount cannot be greater than current balance")
    }

    if (account.balance - accountTransaction.amount < 1000) {
      throw new BankingAppError.BadRequestError(`This violates minimum balance that should be maintained in account`)
    }

    const customer = await accountTransaction.getCustomer(account.customerID, transaction)

    await accountTransaction.updateCustomerBalance(customer.id, parseFloat(customer.balance) - parseFloat(accountTransaction.amount), transaction)
    await accountTransaction.updateAccountBalance(parseFloat(account.balance) - parseFloat(accountTransaction.amount), account.id, transaction)
    await accountTransaction.addAccountTransaction(transaction)

    await transaction.commit()
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const transfer = async (accountTransactionOne, accountTransactionTwo) => {
  try {
    const result = await db.sequelize.transaction(async (transaction) => {
      console.log(accountTransactionOne);
      console.log(accountTransactionTwo);

      // validations
      await accountTransactionOne.doesAccountExist()
      await accountTransactionTwo.doesAccountExist()
      const accountOne = await accountTransactionOne.getAccount(transaction)

      if (accountOne.balance < accountTransactionOne.amount) {
        throw new BankingAppError.BadRequestError("Transfering amount cannot be greater than current balance")
      }

      if (accountOne.balance - accountTransactionOne.amount < 1000) {
        throw new BankingAppError.BadRequestError(`This violates minimum balance that should be maintained in account`)
      }

      const accountTwo = await accountTransactionTwo.getAccount(transaction)

      // do transactions for account one
      const customerOne = await accountTransactionOne.getCustomer(accountOne.customerID, transaction)

      await accountTransactionOne.updateCustomerBalance(customerOne.id, parseFloat(customerOne.balance) - parseFloat(accountTransactionOne.amount), transaction)
      await accountTransactionOne.updateAccountBalance(parseFloat(accountOne.balance) - parseFloat(accountTransactionOne.amount), accountOne.id, transaction)

      await accountTransactionOne.addAccountTransaction(transaction)

      // do transactions for account two
      const customerTwo = await accountTransactionTwo.getCustomer(accountTwo.customerID, transaction)

      await accountTransactionTwo.updateCustomerBalance(customerTwo.id, parseFloat(customerTwo.balance) + parseFloat(accountTransactionTwo.amount), transaction)
      await accountTransactionTwo.updateAccountBalance(parseFloat(accountTwo.balance) + parseFloat(accountTransactionTwo.amount), accountTwo.id, transaction)

      await accountTransactionTwo.addAccountTransaction(transaction)
    })

  } catch (error) {
    console.error(error);
    throw new BankingAppError.BadRequestError(error)
  }
}

const accountTransactions = async (accountID, paginate, queryparams) => {
  const transaction = await db.sequelize.transaction()
  try {
    if (queryparams) {
      queryparams.from_account_id = accountID
    } else {
      queryparams = {
        from_account_id: accountID
      }
    }
    const { count, accountTransactions } = await AccountTransaction.getAccountTransactions(paginate, queryparams)
    await transaction.commit()
    
    return { count, accountTransactions }
  } catch (error) {
    console.error(error);
    await transaction.rollback()
  }
}

module.exports = { addAccount, getAccounts, deposit, withdraw, transfer, accountTransactions }