const express = require("express");
const bankRouter = require("./bank")
const customerRouter = require("./customer")

const router = express.Router()
router.use("/banks", bankRouter)
router.use("/customers", customerRouter)

module.exports = router