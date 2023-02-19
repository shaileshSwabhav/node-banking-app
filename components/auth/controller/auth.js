const { StatusCodes } = require('http-status-codes')
const Credential = require("../../../view/credential/credential")
const JwtToken = require("../../../middleware/jwt")
const { login: loginService, register: registerService } = require("../service/auth")

const register = async (req, res, next) => {
  try {
    const { username, password, roleName } = req.body

    if (!username || !password || !roleName) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Username, password and role name must be specified" })
      return
    }

    const credential = new Credential(null, username, password, roleName)

    const cred = await registerService(credential)

    const jwt = new JwtToken(cred.id, credential.username, cred.roleName)
    const token = jwt.generateToken()

    res.cookie('authorization', token)

    res.status(StatusCodes.OK).json({
      id: cred.id,
      username: credential.username,
      roleName: cred.roleName
    })
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Username and password must be specified" })
      return
    }
    const credential = new Credential(null, username, password, null)

    const cred = await loginService(credential)

    const jwt = new JwtToken(cred.id, credential.username, cred.roleName)
    const token = jwt.generateToken()

    res.cookie('authorization', token)
    res.status(StatusCodes.OK).json({
      id: cred.id,
      username: credential.username,
      roleName: cred.roleName
    })
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { login, register }