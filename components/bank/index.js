const express = require("express");
const { createBank, getAllBanks, updateBank } = require("./controller/bank")

const bankRouter = express.Router()

bankRouter.post("/", createBank)
bankRouter.get("/", getAllBanks)
bankRouter.put("/:bankID", updateBank)
// bankRouter.use("/").get(getAllBanks).post(createBank)

module.exports = bankRouter