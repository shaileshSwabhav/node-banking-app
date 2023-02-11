const express = require("express");
const { addAccount, getAccounts, deposit, withdraw, transfer } = require("./controller/account");
const accountRouter = express.Router()

accountRouter.post("/", addAccount)
accountRouter.get("/", getAccounts)
accountRouter.post("/:accountID/deposit", deposit)
accountRouter.post("/:accountID/withdraw", withdraw)
accountRouter.post("/:accountID/transfer", transfer)

module.exports = accountRouter