const { StatusCodes } = require('http-status-codes')
const { Customer } = require("../../../view/customer/customer")
const {
  addCustomer: addCustomerService,
  getCustomerDetails: getCustomerDetailsService,
  getCustomers: getCustomerService
} = require("../service/customer")

const addCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, balance } = req.body
    const customer = new Customer(firstName, lastName, email, password, balance)

    await addCustomerService(customer)
    res.status(StatusCodes.CREATED).json(null)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

const getCustomers = async (req, res, next) => {
  try {
    const queryparams = req.query
    const { limit, offset } = req.query
    console.log(req.query)

    if (queryparams.limit) {
      delete queryparams.limit
    }

    if (queryparams.offset) {
      delete queryparams.offset
    }

    const { count, customers } = await getCustomerService({ limit, offset }, queryparams)

    res.header("X-Total-Count", count)
    res.status(StatusCodes.OK).json(customers)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const getCustomerDetails = async (req, res, next) => {
  try {
    const customerID = req.params.customerID
    const queryparams = req.query
    console.log(req.query)

    // "ee2e6fd0-2b7c-4b9e-82b0-3ad97802f501"
    const customers = await getCustomerDetailsService(customerID, queryparams)

    res.status(StatusCodes.OK).json(customers)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { addCustomer, getCustomers, getCustomerDetails }