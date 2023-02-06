const { StatusCodes } = require('http-status-codes')
const { addBank, getBanks, updateBank: updateBankService } = require("../service/bank")
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

const getAllBanks = async (req, res, next) => {
  try {
    const queryparams = req.body.query
    const banks = await getBanks(queryparams)

    res.status(StatusCodes.OK).json(banks)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { createBank, getAllBanks, updateBank }