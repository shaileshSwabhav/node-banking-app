const bcrypt = require('bcrypt')

const comparePassword = async (password, hashPassword) => {
  const isMatched = await bcrypt.compare(password, hashPassword);
  return isMatched
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(8)
  return bcrypt.hash(password, 10)
}

module.exports = { comparePassword, hashPassword }