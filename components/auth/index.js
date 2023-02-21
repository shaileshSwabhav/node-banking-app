const express = require("express");
const { login, register, updateCredential } = require("./controller/auth");
const authRouter = express.Router()

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.put("/:credentialID", updateCredential)

module.exports = authRouter