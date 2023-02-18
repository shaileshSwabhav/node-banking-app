const express = require("express");
const { login } = require("./controller/auth");
const authRouter = express.Router()

authRouter.post("/login", login)

module.exports = authRouter