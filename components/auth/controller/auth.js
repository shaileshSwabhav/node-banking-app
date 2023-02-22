const { StatusCodes } = require('http-status-codes')
const Credential = require("../../../view/credential/credential")
const JwtToken = require("../../../middleware/jwt")
const { login: loginService, register: registerService, updateCredential: updateCredentialService } = require("../service/auth")

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

    res.cookie('authorization', token, { maxAge: 900000, httpOnly: false })

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

    res.cookie('authorization', token, {
      httpOnly: false, // try this
      secure: false,
      // domain: 'localhost',
      // sameSite: 'none',
      // maxAge: 1000 * 60 * 10,
    })

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

const logout = async (req, res, next) => {
  try {
    console.log(" =========== inside logout =========== ");
    res.cookie("authorization", "", {
      httpOnly: false, // try this
      expires: new Date(0),
    });
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const updateCredential = async (req, res, next) => {
  try {
    const { username, roleName, isActive } = req.body
    const credentialID = req.params.credentialID

    const credential = new Credential(credentialID, username, undefined, roleName, isActive)
    await updateCredentialService(credential)
    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { login, register, updateCredential, logout }