const express = require("express");
const { addAccount, deposit, withdraw } = require("./controller/account");
const accountRouter = express.Router()

accountRouter.post("/", addAccount)
accountRouter.post("/:accountID/deposit", deposit)
accountRouter.post("/:accountID/withdraw", withdraw)

module.exports = accountRouter