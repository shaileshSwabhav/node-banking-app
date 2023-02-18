const BankingAppError = require("../../../errors")
const db = require("../../../models")
const { Bank } = require("../../../view/bank/bank")

const addBank = async (bank) => {
  const transaction = await db.sequelize.transaction()
  try {
    // validations
    await bank.doesBankAbbreviationExist()

    await bank.addBank(transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const updateBank = async (bank) => {
  const transaction = await db.sequelize.transaction()

  try {
    // validations
    await bank.doesBankExist()
    await bank.doesBankAbbreviationExist()

    // update
    await bank.updateBank(transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const deleteBank = async (bank) => {
  const transaction = await db.sequelize.transaction()

  try {
    console.log("============================= bank id -> ", bank.id);
    // validations
    await bank.doesBankExist()

    // delete
    await bank.deleteBank(transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const getBanks = async (queryparams) => {
  try {
    const banks = await Bank.getBanks(queryparams)
    return banks
  } catch (error) {
    console.error(error);
    throw new BankingAppError.BadRequestError("banks could not be fetched.")
  }
}

module.exports = { addBank, getBanks, updateBank, deleteBank }