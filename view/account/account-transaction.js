const BankingAppError = require("../../errors")
const db = require("../../models")
const { Bank } = require("../bank/bank")

class AccountTransaction {
  constructor(amount, fromAccountID, toAccountID, type, bankID) {
    // this.id = id
    this.amount = amount
    this.fromAccountID = fromAccountID
    this.toAccountID = toAccountID
    this.date = new Date()
    this.type = type
    this.bankID = bankID
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

  createPayload() {
    return {
      from_account_id: this.fromAccountID,
      to_account_id: this.toAccountID,
      amount: this.amount,
      date: this.date,
      type: this.type,
      bank_id: this.bankID
    }
  }

  async addAccountTransaction(transaction) {
    try {
      const accountTransaction = await db.AccountTransaction.create(this.createPayload(), {
        transaction: transaction
      })

      return accountTransaction
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

  static createAccTransResponse(accountTransaction) {
    return {
      id: accountTransaction.id,
      amount: accountTransaction.amount,
      fromAccountID: accountTransaction.from_account_id,
      toAccountID: accountTransaction.to_account_id,
      date: accountTransaction.date,
      type: accountTransaction.type,
      bankID: accountTransaction.bank_id,
      bank: this.createBankResponse(accountTransaction.Bank)
    }
  }

  static createBankResponse(bank) {
    const b = new Bank(bank.full_name, bank.abbreviation)
    b.setBankID(bank.id)

    return b
  }

  static async getAccountTransactions(paginate, queryparams) {
    try {
      const { count, rows } = await db.AccountTransaction.findAndCountAll({
        where: queryparams,
        limit: paginate.limit || 5,
        offset: (paginate.limit * paginate.offset) || 0,
        order: [
          ['createdAt', 'DESC']
        ],
        include: [{
          model: db.Bank,
          required: true,
        }],
      })

      const accountTransactions = []

      for (let index = 0; index < rows.length; index++) {
        accountTransactions.push(this.createAccTransResponse(rows[index]))
      }

      return { count, accountTransactions }
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }
}

module.exports = { AccountTransaction }