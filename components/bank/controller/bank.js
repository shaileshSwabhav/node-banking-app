const { StatusCodes } = require('http-status-codes')
const { addBank, getBanks, updateBank: updateBankService, deleteBank: deleteBankService } = require("../service/bank")
const { Bank } = require("../../../view/bank/bank")

const createBank = async (req, res, next) => {
  try {
    const { fullName, abbreviation } = req.body
    const bank = new Bank(fullName, abbreviation)
    await addBank(bank)

    res.status(StatusCodes.CREATED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const updateBank = async (req, res, next) => {
  try {
    const bankID = req.params.bankID
    const { fullName, abbreviation } = req.body
    const bank = new Bank(fullName, abbreviation)
    bank.setBankID(bankID)

    await updateBankService(bank)

    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const deleteBank = async (req, res, next) => {
  try {
    const bankID = req.params.bankID
    const bank = new Bank()
    bank.setBankID(bankID)

    await deleteBankService(bank)

    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const getAllBanks = async (req, res, next) => {
  try {
    const queryparams = req.query
    const banks = await getBanks(queryparams)

    res.setHeader("X-Total-Count", banks.count)
    res.status(StatusCodes.OK).json(banks.rows)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { createBank, getAllBanks, updateBank, deleteBank }