const express = require("express");
const { addCustomer, getCustomerDetails } = require("./controller/customer");
const customerRouter = express.Router()

customerRouter.post("/", addCustomer)
customerRouter.get("/", getCustomerDetails)

module.exports = customerRouter