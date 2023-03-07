const db = require("../../models/index")
const BankingAppError = require("../../errors")
const { Op } = require("sequelize");
const uuid = require("uuid");
const { paginate } = require("../../util/util");

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
  }

  async doesBankExist() {
    const findBank = await db.Bank.findOne({
      where: {
        id: this.id,
      }
    })

    if (!findBank) {
      throw new BankingAppError.BadRequestError("Bank not found.")
    }

  }

  async addBank(transaction) {
    try {
      const bank = await db.Bank.create(this.createPayload(), { transaction: transaction })
      return bank
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError("Bank could not be added")
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

  static async getBanks(queryparams) {
    // const response = await db.Bank.findAll({
    //   where: queryparams
    // })

    const pagination = paginate(queryparams)

    const response = await db.Bank.findAndCountAll({
      attributes: ['id', ['full_name', 'fullName'], 'abbreviation'],
      where: queryparams,
      ...pagination,
    })

    return response;
  }


}

module.exports = { Bank }