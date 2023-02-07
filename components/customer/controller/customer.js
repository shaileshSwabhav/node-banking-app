const { StatusCodes } = require('http-status-codes')
const { Customer } = require("../../../view/customer/customer")
const { addCustomer: addCustomerService, getCustomerDetails: getCustomerDetailsService } = require("../service/customer")

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

const getCustomerDetails = async (req, res, next) => {
  try {
    const queryparams = req.query
    console.log(req.query);

    const customers = await getCustomerDetailsService("ee2e6fd0-2b7c-4b9e-82b0-3ad97802f501")
    
    res.status(StatusCodes.OK).json(customers)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { addCustomer, getCustomerDetails }