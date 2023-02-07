const BankingAppError = require("../../errors")
const db = require("../../models")

class AccountTransaction {
  constructor(amount, fromAccountID, toAccountID) {
    // this.id = id
    this.amount = amount
    this.fromAccountID = fromAccountID
    this.toAccountID = toAccountID
    this.date = new Date()
    // this.type = type
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

  async doesAccountExist(accountID) {
    try {
      accountID = accountID || this.fromAccountID
      const findAccount = await db.Account.findOne({
        where: {
          id: accountID,
        }
      })

      if (!findAccount) {
        throw new BankingAppError.BadRequestError("Account not found.")
      }
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

  async updateAccountBalance(balance, accountID, transaction) {
    try {
      accountID = accountID || this.fromAccountID
      await db.Account.update({
        balance: balance
      }, {
        where: {
          id: accountID
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

  async getAccount(transaction, accountID) {
    try {
      accountID = accountID || this.fromAccountID
      const account = await db.Account.findOne({
        where: {
          id: accountID
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