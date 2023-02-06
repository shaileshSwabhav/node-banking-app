class BankingAppError extends Error {
  constructor(errorMessage) {
    super(errorMessage)
  }
}

module.exports = BankingAppError