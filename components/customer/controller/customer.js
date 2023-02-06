const { StatusCodes } = require('http-status-codes')
const { Customer } = require("../../../view/customer/customer")
const { addCustomer: addCustomerService } = require("../service/customer")

const addCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, balance } = req.body
    const customer = new Customer(firstName, lastName, email, password, balance)

    await addCustomerService(customer)

    res.status(StatusCodes.CREATED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { addCustomer }