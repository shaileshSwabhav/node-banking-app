const express = require("express");
const { login, register, dummyLogin } = require("./controller/auth");
const authRouter = express.Router()

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.post("/dummy-login", dummyLogin)

module.exports = authRouter