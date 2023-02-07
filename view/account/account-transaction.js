const BankingAppError = require("../../errors")
const db = require("../../models")

class AccountTransaction {
  constructor(id, amount) {
    this.id = id
    this.amount = amount
    this.accountID = null
  }

  setAccountID(accountID) {
    this.accountID = accountID
  }

  setID(id) {
    this.id = id
  }

  setAmount(amount) {
    this.amount = amount
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

  async deposit(transaction) {
    try {
      const account = await this.getAccount(transaction)
      const customer = await this.getCustomer(account.customerID, transaction)

      await this.updateCustomerBalance(customer.id, customer.balance + this.amount, transaction)
      // this.amount = account.balance + this.amount
      await this.updateAccountBalance(account.balance + this.amount, transaction)
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async withdraw(transaction) {
    try {
      const account = await this.getAccount(transaction)

      if (account.balance < this.amount) {
        throw new BankingAppError.BadRequestError("Withdrawing amount cannot be greater than current balance")
      }

      if (account.balance - this.amount < 1000) {
        throw new BankingAppError.BadRequestError(`This violates minimum balance that should be maintained in account`)
      }

      const customer = await this.getCustomer(account.customerID, transaction)

      await this.updateCustomerBalance(customer.id, customer.balance - this.amount, transaction)
      await this.updateAccountBalance(account.balance - this.amount, transaction)
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async updateCustomerBalance(customerID, balance, transaction) {
    try {
      await db.Customer.update({
        balance: balance
      }, {
        where: {
          id: customerID
        },
        transaction: transaction
      })
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async updateAccountBalance(balance, transaction) {
    try {
      await db.Account.update({
        balance: balance
      }, {
        where: {
          id: this.id
        },
        transaction: transaction
      })
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  createCustomerResponse(customer) {
    return {
      id: customer.id,
      fistName: customer.first_name,
      lastName: customer.first_name,
      email: customer.email,
      balance: customer.balance,
    }
  }

  async getCustomer(customerID, transaction) {
    try {
      const customer = await db.Customer.findOne({
        where: {
          id: customerID
        },
        transaction: transaction
      })
      return this.createCustomerResponse(customer)
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  createAccountResponse(account) {
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
      return this.createAccountResponse(account)
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }
}

module.exports = { AccountTransaction }