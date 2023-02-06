const { v4 } = require("uuid");

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
  
}

module.exports = { Customer }