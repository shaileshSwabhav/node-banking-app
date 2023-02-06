const db = require("../../models/index")
const BankingAppError = require("../../errors")
const { Op } = require("sequelize");
const uuid = require("uuid")

class Customer {
  constructor(firstName, lastName, email, password, balance) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.balance = balance
  }

  setCustomerID(id) {
    this.id = id
  }

  setFirstName(firstName) {
    this.firstName = firstName
  }

  setLastName(lastName) {
    this.lastName = lastName
  }

  setEmail(email) {
    this.email = email
  }

  setBalance(balance) {
    this.balance = balance
  }

  createPayload() {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      balance: this.balance,
    }
  }

  async doesEmailExist() {
    try {
      const findEmail = await db.Customer.findOne({
        where: {
          email: this.email,
          id: {
            [Op.not]: this.id ? this.id : uuid.NIL
          },
        }
      })

      if (findEmail) {
        throw new BankingAppError.BadRequestError("Customer email exist. Please try with new email")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async addCustomer(transaction) {
    try {
      const customer = await db.Customer.create(this.createPayload(), { transaction: transaction })
      return customer
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }

  static createResponse(customer) {
    return {
      id: customer.id,
      fistName: customer.first_name,
      lastName: customer.first_name,
      abbreviation: bank.abbreviation
    }
  }

  async getAllCustomers() {

  }
}

module.exports = { Customer }