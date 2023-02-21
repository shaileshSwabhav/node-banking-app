const BankingAppError = require("../../../errors")
const db = require("../../../models")
const Credential = require("../../../view/credential/credential")

const register = async (credential, transaction) => {
  let isTransactionPassed = true

  if (!transaction) {
    isTransactionPassed = false
    transaction = await db.sequelize.transaction()
  }

  try {
    await credential.doesUsernameExist()
    await credential.addCredential()

    if (!isTransactionPassed) {
      await transaction.commit()
    }
    return credential
  } catch (error) {
    console.error(error);
    if (!isTransactionPassed) {
      await transaction.rollback()
    }
    throw new BankingAppError.BadRequestError("Could not register user")
  }
}

const login = async (credential) => {
  const transaction = await db.sequelize.transaction()

  try {
    const cred = await Credential.getCredential({ username: credential.username, password: credential.password, is_active: true })
    await transaction.commit()

    return cred
  } catch (error) {
    console.error(error);
    await transaction.rollback()
    throw new BankingAppError.BadRequestError("Invalid username or password")
  }
}

const updateCredential = async (credential) => {
  const transaction = await db.sequelize.transaction()
  try {
    await credential.doesCredentialExist()
    const cred = await credential.updateCredential(transaction)
    await transaction.commit()

    return cred
  } catch (error) {
    console.error(error);
    await transaction.rollback()
    throw new BankingAppError.BadRequestError(error)
  }
}

module.exports = { register, login, updateCredential }