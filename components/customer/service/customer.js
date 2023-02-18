const BankingAppError = require("../../../errors")
const db = require("../../../models")
const { Customer } = require("../../../view/customer/customer")
const { register } = require("../../auth/service/auth")
const Credential = require("../../../view/credential/credential")

const addCustomer = async (customer) => {
  const transaction = await db.sequelize.transaction()
  try {
    // validations
    await customer.doesEmailExist()
    const response = await customer.addCustomer(transaction)

    const cred = new Credential(response.id, customer.email, customer.password, "Customer")
    await register(cred, transaction)

    await transaction.commit()
  } catch (error) {
    console.error(error);
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const getCustomerDetails = async (customerID) => {
  const transaction = await db.sequelize.transaction()
  try {
    const queryparams = {
      // id: customerID
    }

    const customers = await Customer.getCustomers(queryparams)
    await transaction.commit()

    return customers
  } catch (error) {
    console.error(error);
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

const getCustomer = async () => {

}

module.exports = { addCustomer, getCustomer, getCustomerDetails }