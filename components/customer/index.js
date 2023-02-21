const express = require("express");
const { addCustomer, getCustomers, getCustomerDetails } = require("./controller/customer");
const customerRouter = express.Router()

customerRouter.post("/", addCustomer)
customerRouter.get("/", getCustomers)
customerRouter.get("/:customerID", getCustomerDetails)

module.exports = customerRouter