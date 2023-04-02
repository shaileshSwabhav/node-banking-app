'use strict';

/** @type {import('sequelize-cli').Migration} */
const { v4 } = require("uuid")
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const banks = []

    for (let index = 1; index < 1000000; index++) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 7) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }

      banks.push({
        id: v4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: result,
        abbreviation: result,
      })
    }

    await queryInterface.bulkInsert('banks', banks, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
