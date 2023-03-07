const { expect } = require("chai")
const { Bank } = require("../../../view/bank/bank")
const { addBank, updateBank, deleteBank, getBanks } = require("./bank")

describe("unit testing bank service", () => {
  it("unit test add bank", async () => {
    try {
      const bank = new Bank("Axis Bank", "Axis")
      const response = await addBank(bank)
      expect(response.id).to.not.be.null;
    } catch (error) {
      console.log("inside error", error.message);
    }
  })

  it("unit test update bank", async () => {
    try {
      const bank = new Bank("State Bank Of India", "SBI")
      bank.setBankID("f2496bc7-b0d1-41d4-a7d3-e52bf9b018a3")
      const response = await updateBank(bank)
      expect(response.id).to.not.be.null;
    } catch (error) {
      console.log("inside error", error.message);
    }
  })

  it("unit test delete bank", async () => {
    try {
      const bank = new Bank()
      bank.setBankID("f2d9bc82-9ac1-4847-b76f-db38002ea59d")
      const response = await deleteBank(bank)
      expect(response.id).to.not.be.null;
    } catch (error) {
      console.log("inside error", error.message);
    }
  })

  it("unit test get all bank", async () => {
    try {
      const response = await getBanks({ limit: 5, offset: 0 })
      expect(response.rows.length).to.be.equal(5);
    } catch (error) {
      console.log("inside error", error.message);
    }
  })
})