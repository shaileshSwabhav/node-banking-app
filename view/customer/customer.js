const db = require("../../models/index")
const BankingAppError = require("../../errors")
const { Op } = require("sequelize");
const uuid = require("uuid")
const { Account } = require("../account/account");
const { AccountTransaction } = require("../account/account-transaction");

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

  async addCustomer(transaction) {
    try {
      const customer = await db.Customer.create(this.createPayload(), { transaction: transaction })
      return customer
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }

  // static createResponse(customer) {
  //   return {
  //     id: customer.id,
  //     fistName: customer.first_name,
  //     lastName: customer.first_name,
  //     email: customer.email,
  //     balance: customer.balance,
  //   }
  // }

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

    if (acc.AccountTransactions && acc.AccountTransactions?.length > 0) {
      for (let index = 0; index < acc.AccountTransactions.length; index++) {
        account.accountTransaction.push(Customer.createAccountTransactionResponse(acc.AccountTransactions[index]))
      }
    }
    return account
  }

  static createAccountTransactionResponse(transaction) {
    const accountTransaction = new AccountTransaction(transaction.amount, transaction.from_account_id,
      transaction.to_account_id, transaction.type, transaction.bank_id)
    accountTransaction.setID(transaction.id)

    return accountTransaction
  }

  static async getCustomers(queryparams) {
    try {

      const cust = await db.Customer.findAll({
        where: queryparams,
        order: [
          ['createdAt', 'ASC']
        ],
      })

      console.log("=================");

      const customers = []
      if (cust && cust?.length > 0) {
        for (let index = 0; index < cust?.length; index++) {
          customers.push(Customer.createCustomerResponse(cust[index]))
        }
      }

      return customers
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }

  static async getCustomerDetails(queryparams) {
    try {

      // include will do default outer join.
      // this can be overridden with required:true -> this will do inner join

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

      // return cust
      return customers
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }
}

module.exports = { Customer }