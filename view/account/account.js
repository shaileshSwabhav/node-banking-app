const { v4 } = require("uuid")

class Account {
  constructor(accountName, bankID, customerID, balance) {
    this.customerID = v4()
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
}

module.exports = { Account }