const BankingAppError = require("../../../errors")
const db = require("../../../models")

const addAccount = async (account) => {
  const transaction = await db.sequelize.transaction()
  try {

    // validations
    await account.doesBankExist(account.bankID)
    await account.doesCustomerExist(account.customerID)
    await account.doesAccountExistForBank()

    // add
    await account.addAccount()
    await transaction.commit()
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const deposit = async (accountTransaction) => {
  const transaction = await db.sequelize.transaction()
  try {

    await accountTransaction.doesAccountExist()
    await accountTransaction.deposit()
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
    await accountTransaction.withdraw()
    await transaction.commit()
  } catch (error) {
    console.error(error)
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

module.exports = { addAccount, deposit, withdraw }