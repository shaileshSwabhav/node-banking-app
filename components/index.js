const express = require("express");
const bankRouter = require("./bank")
const customerRouter = require("./customer")
const accountRouter = require("./account")

const router = express.Router()
router.use("/banks", bankRouter)
router.use("/customers", customerRouter)
router.use("/accounts", accountRouter)

module.exports = router