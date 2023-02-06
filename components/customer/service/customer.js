const BankingAppError = require("../../../errors")
// const db = require("../../../models")
// const { Customer } = require("../../../view/customer/customer")


const addCustomer = async (customer) => {
  try {

    // validations
    await customer.doesEmailExist()

    await customer.addCustomer()
  } catch (error) {
    console.error(error);
    throw new BankingAppError.BadRequestError(error)
  }
}

module.exports = { addCustomer }