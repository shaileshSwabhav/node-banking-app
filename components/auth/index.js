const express = require("express");
const JwtToken = require("../../middleware/jwt");
const { login, register, updateCredential, logout } = require("./controller/auth");
const authRouter = express.Router()

authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/register", register)
authRouter.put("/:credentialID", updateCredential)

module.exports = authRouter