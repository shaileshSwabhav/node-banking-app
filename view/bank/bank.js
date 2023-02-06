const db = require("../../models/index")
const BankingAppError = require("../../errors")
const { Op } = require("sequelize");
const uuid = require("uuid")

class Bank {
  constructor(fullName, abbreviation) {
    this.fullName = fullName
    this.abbreviation = abbreviation
  }

  setBankID(id) {
    this.id = id
  }

  setFullName(fullName) {
    this.fullName = fullName
  }

  setabbreviation(abbreviation) {
    this.abbreviation = abbreviation
  }

  createPayload() {
    return {
      id: this.id,
      full_name: this.fullName,
      abbreviation: this.abbreviation,
    }
  }

  async doesBankAbbreviationExist() {
    try {
      const findAbbreviation = await db.Bank.findOne({
        where: {
          abbreviation: this.abbreviation,
          id: {
            [Op.not]: this.id ? this.id : uuid.NIL
          },
        }
      })

      if (findAbbreviation) {
        throw new BankingAppError.BadRequestError("Abbreviation already exist.")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async doesBankExist() {
    try {
      const findBank = await db.Bank.findOne({
        where: {
          id: this.id,
        }
      })

      if (!findBank) {
        throw new BankingAppError.BadRequestError("Bank not found.")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async addBank(transaction) {
    try {
      const bank = await db.Bank.create(this.createPayload(), { transaction: transaction })
      return bank
    } catch (error) {
      console.error(error);
    }
  }

  async updateBank(transaction) {
    try {
      const bank = await db.Bank.update(this.createPayload(), {
        where: {
          id: this.id
        },
        transaction: transaction
      })
      return bank
    } catch (error) {
      console.error(error);
    }
  }

  async deleteBank(transaction) {
    try {
      const bank = await db.Bank.destroy({
        where: {
          id: this.id
        },
        transaction: transaction
      })
      return bank
    } catch (error) {
      console.error(error);
    }
  }

  static createResponse(bank) {
    return {
      id: bank.id,
      fullName: bank.full_name,
      abbreviation: bank.abbreviation
    }
  }

  static async getBanks(queryparams) {
    const response = await db.Bank.findAll({
      where: queryparams
    })

    let banks = []

    if (response?.length > 0) {
      for (let index = 0; index < response.length; index++) {
        banks.push(this.createResponse(response[index]))
      }
    }

    return banks;
  }

}

module.exports = { Bank }