const BankingAppError = require("../../errors")
const { AccountTransaction } = require("./account-transaction")

class Account {
  constructor(accountName, bankID, customerID, balance) {
    this.accountName = accountName
    this.bankID = bankID
    this.customerID = customerID
    this.balance = balance
  }

  setAccountID(id) {
    this.customerID = id
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

  async doesBankExist(bankID) {
    try {
      const findBank = await db.Bank.findOne({
        where: {
          id: bankID,
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

      if (!findAccount) {
        throw new BankingAppError.BadRequestError("Account already exist for specified bank.")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  createPayload() {
    return {
      id: this.id,
      accountName: this.accountName,
      bankID: this.bankID,
      customerID: this.customerID,
      balance: this.balance,
    }
  }

  async addAccount(transaction) {
    try {
      const account = await db.Account.create(this.createPayload(), { transaction: transaction })
      const customer = await this.getCustomer(transaction)

      const accountTransaction = new AccountTransaction(this.id, this.balance)
      await accountTransaction.updateCustomerBalance(customer.balance + this.balance, transaction)
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

  async getAccount(transaction) {
    try {
      await db.Account.findOne({
        where: {
          id: this.id
        },
        transaction: transaction
      })
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async getCustomer(transaction) {
    try {
      await db.Customer.findOne({
        where: {
          id: this.customerID
        },
        transaction: transaction
      })
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

}

module.exports = { Account }