const { Bank } = require("./bank")
const { expect } = require("chai")

describe("unit testing bank view", () => {
  it("setFullName", () => {
    const bank = new Bank("State bank", "SBI")
    bank.setFullName("State bank of india")

    expect(bank.fullName).to.be.equal("State bank of india")
  })

  it("set wrong full name", () => {
    const bank = new Bank("State bank", "SBI")
    bank.setFullName("State Bank Of India")

    expect(bank.fullName).to.not.equal("State bank of india")
  })

  it("setabbreviation", () => {
    const bank = new Bank("State bank", "SBI")
    bank.setabbreviation("sbi")

    expect(bank.abbreviation).to.be.equal("sbi")
  })

  it("getBanks", async () => {
    const banks = await Bank.getBanks({ limit: 1, offset: 0 })
    expect(banks.rows.length).to.be.equal(1)
  })
})