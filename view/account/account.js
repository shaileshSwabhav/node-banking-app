const BankingAppError = require("../../errors")
const { AccountTransaction } = require("./account-transaction")
const db = require("../../models")

class Account {
  constructor(accountName, bankID, customerID, balance) {
    this.accountName = accountName
    this.bankID = bankID
    this.customerID = customerID
    this.balance = balance
    this.accountTransaction = []
  }

  setID(id) {
    this.id = id
  }

  setAccountName(accountName) {
    this.accountName = accountName
  }

  setBankID(bankID) {
    this.bankID = bankID
  }

  setCustomerID(customerID) {
    this.customerID = customerID
  }

  setBalance(balance) {
    this.balance = balance
  }

  async doesAccountExist() {
    try {
      const findAccount = await db.Account.findOne({
        where: {
          id: this.id,
        }
      })

      if (!findAccount) {
        throw new BankingAppError.BadRequestError("Account not found.")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async doesBankExist() {
    try {
      const findBank = await db.Bank.findOne({
        where: {
          id: this.bankID,
        }
      })

      if (!findBank) {
        throw new BankingAppError.BadRequestError("Bank not found.")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async doesCustomerExist(customerID) {
    try {
      const findCustomer = await db.Customer.findOne({
        where: {
          id: customerID,
        }
      })

      if (!findCustomer) {
        throw new BankingAppError.BadRequestError("Customer not found.")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async doesAccountExistForBank() {
    try {
      const findAccount = await db.Account.findOne({
        where: {
          bank_id: this.bankID,
          customer_id: this.customerID
        }
      })

      if (findAccount) {
        throw new BankingAppError.BadRequestError("Account already exist for specified bank.")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  createPayload() {
    return {
      id: this.id,
      account_name: this.accountName,
      bank_id: this.bankID,
      customer_id: this.customerID,
      balance: this.balance,
    }
  }

  async addAccount(transaction) {
    try {
      const account = await db.Account.create(this.createPayload(), { transaction: transaction })
      const customer = await this.getCustomer(transaction)

      const accountTransaction = new AccountTransaction(this.balance, this.id)
      const balance = customer.balance + this.balance
      await accountTransaction.updateCustomerBalance(this.customerID, balance, transaction)
      return account
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async updateAccount(transaction) {
    try {
      const account = await db.Account.update(this.createPayload, {
        where: {
          id: this.id
        },
        transaction: transaction
      })
      return account
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  static createResponse(account) {
    return {
      id: account.id,
      accountName: account.account_name,
      bankID: account.bank_id,
      customerID: account.customer_id,
      balance: account.balance,
    }
  }

  async getAccount(transaction) {
    try {
      const account = await db.Account.findOne({
        where: {
          id: this.id
        },
        transaction: transaction
      })

      return Account.createResponse(account)
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async getAccounts(transaction, queryparams) {
    try {
      const tempAccounts = await db.Account.findAll({
        where: queryparams,
        transaction: transaction
      })

      const accounts = []

      for (let index = 0; index < tempAccounts.length; index++) {
        accounts.push(Account.createResponse(tempAccounts[index]))
      }

      return accounts
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async getCustomer(transaction) {
    try {
      const customer = await db.Customer.findOne({
        where: {
          id: this.customerID
        },
        transaction: transaction
      })
      return customer
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

}

module.exports = { Account }