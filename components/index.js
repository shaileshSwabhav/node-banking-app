const express = require("express");
const bankRouter = require("./bank")

const router = express.Router()
router.use("/banks", bankRouter)

module.exports = router