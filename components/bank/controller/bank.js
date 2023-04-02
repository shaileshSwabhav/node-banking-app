const { StatusCodes } = require('http-status-codes')
const { addBank, getBanks, updateBank: updateBankService, deleteBank: deleteBankService } = require("../service/bank")
const { Bank } = require("../../../view/bank/bank")
const { redisClient, getCacheData } = require("../../../caching/redis")

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
    const redisQuery = { ...req.query }
    console.log(redisQuery);

    // const response = await redisClient.get(`banks?${JSON.stringify(redisQuery)}`, async (error, banks) => {
    //   console.log("iniside get redis client");
    //   if (error) {
    //     console.error(error);
    //   }
    //   if (banks) {
    //     console.log("inside redis data");
    //     return JSON.parse(banks)
    //   }
    // })

    const response = await getCacheData(`banks?${JSON.stringify(redisQuery)}`)
    console.log("after redis client get");

    if (response) {
      res.status(StatusCodes.OK).json(JSON.parse(response))
      return
    }

    console.log("redis cache not found");
    const banks = await getBanks(queryparams)
    console.log(queryparams);
    redisClient.setEx(`banks?${JSON.stringify(redisQuery)}`, process.env.DEFAULT_EXPIRATION, JSON.stringify(banks.rows))

    res.setHeader("X-Total-Count", banks.count)
    res.status(StatusCodes.OK).json(banks.rows)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { createBank, getAllBanks, updateBank, deleteBank }