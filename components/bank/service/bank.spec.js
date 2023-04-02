const { expect } = require("chai")
const BankingAppError = require("../../../errors")
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

  // it("unit test duplicate bank abbreviation", async () => {
  //   const bank = new Bank("HDFC Bank", "HDFC")
    // const response = await addBank(bank)
    // const func = async function () {
    //   try {
    //     console.log("inside function");
    //     await addBank(bank)
    //     console.log("function ended");
    //   } catch (error) {
    //     console.log("============== error", error.message);
    //     throw new BankingAppError.BadRequestError(error.message)
    //   }
    // }
    // expect(func).to.throw()
  // })

  it("unit test update bank", async () => {
    try {
      const bank = new Bank("Kotak Mahindra Bank", "Kotak")
      bank.setBankID("f210418f-ad41-45cf-9a43-e9cb071a328f")
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