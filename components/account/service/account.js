const BankingAppError = require("../../../errors")
const db = require("../../../models")

const addAccount = async (account) => {
  try {
    // managed transaction.
    const result = await db.sequelize.transaction(async (transaction) => {

      // validations
      await account.doesBankExist(account.bankID)
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

const deposit = async (accountTransaction) => {
  const transaction = await db.sequelize.transaction()
  try {
    await accountTransaction.doesAccountExist()
    // await accountTransaction.deposit(transaction)

    const account = await accountTransaction.getAccount(transaction)
    const customer = await accountTransaction.getCustomer(account.customerID, transaction)

    await accountTransaction.updateCustomerBalance(customer.id, customer.balance + accountTransaction.amount, transaction)
    await accountTransaction.updateAccountBalance(account.balance + accountTransaction.amount, account.id, transaction)

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

    await accountTransaction.updateCustomerBalance(customer.id, customer.balance - accountTransaction.amount, transaction)
    await accountTransaction.updateAccountBalance(account.balance - accountTransaction.amount, account.id, transaction)
    await accountTransaction.addAccountTransaction(transaction)

    await transaction.commit()
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const transfer = async (accountTransaction) => {
  try {
    const result = await db.sequelize.transaction(async (transaction) => {
      console.log(accountTransaction);

      // validations
      await accountTransaction.doesAccountExist()
      const accountOne = await accountTransaction.getAccount(transaction)

      if (accountOne.balance < accountTransaction.amount) {
        throw new BankingAppError.BadRequestError("Transfering amount cannot be greater than current balance")
      }

      if (accountOne.balance - accountTransaction.amount < 1000) {
        throw new BankingAppError.BadRequestError(`This violates minimum balance that should be maintained in account`)
      }

      const accountTwo = await accountTransaction.getAccount(transaction, accountTransaction.accountID)
      console.log("accountOne -> ", accountOne);
      console.log("accountTwo -> ", accountTwo);

      // do transactions for account one
      const customerOne = await accountTransaction.getCustomer(accountOne.customerID, transaction)

      await accountTransaction.updateCustomerBalance(customerOne.id, customerOne.balance - accountTransaction.amount, transaction)
      await accountTransaction.updateAccountBalance(accountOne.balance - accountTransaction.amount, accountOne.id, transaction)

      // do transactions for account two
      const customerTwo = await accountTransaction.getCustomer(accountTwo.customerID, transaction)

      await accountTransaction.updateCustomerBalance(customerTwo.id, customerTwo.balance + accountTransaction.amount, transaction)
      await accountTransaction.updateAccountBalance(accountTwo.balance + accountTransaction.amount, accountTwo.id, transaction)

      await accountTransaction.addAccountTransaction(transaction)
    })

  } catch (error) {
    console.error(error);
    throw new BankingAppError.BadRequestError(error)
  }
}

module.exports = { addAccount, deposit, withdraw, transfer }