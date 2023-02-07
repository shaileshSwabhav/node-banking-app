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
    await accountTransaction.deposit(transaction)
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
    await accountTransaction.withdraw(transaction)
    await transaction.commit()
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

module.exports = { addAccount, deposit, withdraw }