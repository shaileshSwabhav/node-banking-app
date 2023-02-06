const express = require("express");
const { createBank, getAllBanks, updateBank, deleteBank } = require("./controller/bank");

const bankRouter = express.Router()

bankRouter.post("/", createBank)
bankRouter.get("/", getAllBanks)
bankRouter.put("/:bankID", updateBank)
bankRouter.delete("/:bankID", deleteBank)
// bankRouter.use("/").get(getAllBanks).post(createBank)

module.exports = bankRouter