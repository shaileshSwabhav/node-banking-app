const express = require("express");
const { addCustomer } = require("./controller/customer");
const customerRouter = express.Router()

customerRouter.post("/", addCustomer)

module.exports = customerRouter