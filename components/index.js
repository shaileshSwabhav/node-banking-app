const express = require("express");
const authRouter = require("./auth")
const bankRouter = require("./bank")
const customerRouter = require("./customer")
const accountRouter = require("./account")

const router = express.Router()
router.use("/auth", authRouter)
router.use("/banks", bankRouter)
router.use("/customers", customerRouter)
router.use("/accounts", accountRouter)

module.exports = router