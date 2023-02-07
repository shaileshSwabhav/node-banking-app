const db = require("../../models/index")
const BankingAppError = require("../../errors")
const { Op } = require("sequelize");
const uuid = require("uuid")
const { Account } = require("../account/account")

class Customer {
  constructor(firstName, lastName, email, password, balance) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.balance = balance
    this.accounts = []
  }

  setID(id) {
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
      email: customer.email,
      balance: customer.balance,
    }
  }

  static createCustomerResponse(cust) {
    const customer = new Customer(cust.first_name, cust.last_name, cust.email, cust.password, cust.balance)
    delete customer.password

    customer.setID(cust.id)

    if (cust.Accounts && cust.Accounts?.length > 0) {
      for (let index = 0; index < cust.Accounts.length; index++) {
        customer.accounts.push(Customer.createAccountResponse(cust.Accounts[index]))
      }
    }

    return customer
  }

  static createAccountResponse(acc) {
    const account = new Account(acc.account_name, acc.bank_id, acc.customer_id, acc.balance)
    account.setID(acc.id)
    return account
  }

  static async getCustomers(queryparams) {
    try {
      const cust = await db.Customer.findAll({
        where: queryparams,
        include: [{
          model: db.Account,
          required: true,
          include: [{
            model: db.AccountTransaction,
          }],
        }],
        order: [
          ['createdAt', 'ASC']
        ],
      })

      const customers = []
      if (cust && cust?.length > 0) {
        for (let index = 0; index < cust?.length; index++) {
          customers.push(Customer.createCustomerResponse(cust[index]))
        }
      }

      return cust
      // return customers
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }
}

module.exports = { Customer }