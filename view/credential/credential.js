const db = require("../../models/index")
const BankingAppError = require("../../errors")
const { Op } = require("sequelize");
const uuid = require("uuid")

class Credential {
  constructor(id, username, password, roleName, isActive) {
    this.id = id
    this.username = username
    this.password = password
    this.roleName = roleName
    this.isActive = isActive
  }

  setID(id) {
    this.id = id
  }

  setUsername(username) {
    this.username = username
  }

  setRoleName(roleName) {
    this.roleName = roleName
  }

  setIsActive(isActive) {
    this.isActive = isActive
  }

  async doesUsernameExist() {
    try {
      const findUsername = await db.Credential.findOne({
        where: {
          username: this.username,
          id: {
            [Op.not]: this.id ? this.id : uuid.NIL
          },
        }
      })

      if (findUsername) {
        throw new BankingAppError.BadRequestError("Username exist. Please try with new username")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async doesCredentialExist() {
    try {
      const findCredential = await db.Credential.findOne({
        where: {
          id: this.id,
        }
      })

      if (!findCredential) {
        throw new BankingAppError.BadRequestError("Credential not found")
      }
    } catch (error) {
      throw new BankingAppError.BadRequestError(error)
    }
  }

  createPayload() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      role_name: this.roleName,
      is_active: this.isActive
    }
  }

  async addCredential(transaction) {
    try {
      if (!this.id) {
        this.id = uuid.v4()
      }
      console.log(this);
      const credential = await db.Credential.create(this.createPayload(), { transaction: transaction })
      return credential
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }

  async updateCredential(transaction) {
    try {
      const credential = await db.Credential.update(this.createPayload(), {
        where: {
          id: this.id
        },
        transaction: transaction,
        // fields: ['password']
      })
      return credential
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }

  static createResponse(credential) {
    return {
      id: credential.id,
      username: credential.username,
      password: credential.password,
      roleName: credential.role_name,
      isActive: credential.is_active,
    }
  }

  static async getCredential(queryparams) {
    try {

      // include will do default outer join.
      // this can be overridden with required:true -> this will do inner join

      const cred = await db.Credential.findOne({
        where: queryparams,
      })

      if (cred) {
        return Credential.createResponse(cred)
      }

      throw new BankingAppError.BadRequestError({ error: "Incorrect username or password" })
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }

  static async getCredentials(queryparams) {
    try {

      // include will do default outer join.
      // this can be overridden with required:true -> this will do inner join

      const cred = await db.Credential.findAll({
        where: queryparams,
        order: [
          ['createdAt', 'ASC']
        ],
      })

      const credentials = []
      if (cred && cred?.length > 0) {
        for (let index = 0; index < cred?.length; index++) {
          credentials.push(Credential.createResponse(cred[index]))
        }
      }

      return credentials
    } catch (error) {
      console.error(error);
      throw new BankingAppError.BadRequestError(error)
    }
  }
}

module.exports = Credential