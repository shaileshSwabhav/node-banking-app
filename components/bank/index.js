const express = require("express");
const JwtToken = require("../../middleware/jwt");
const { createBank, getAllBanks, updateBank, deleteBank } = require("./controller/bank");

const bankRouter = express.Router()

bankRouter.post("/", JwtToken.authenticateCookie, createBank)
bankRouter.get("/", JwtToken.authenticateCookie, getAllBanks)
bankRouter.put("/:bankID", updateBank)
bankRouter.delete("/:bankID", deleteBank)
// bankRouter.use("/").get(getAllBanks).post(createBank)

module.exports = bankRouter