class BankingAppError extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports = BankingAppError
