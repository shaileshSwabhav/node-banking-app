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

    const users = []
    const credentials = []

    for (let index = 1; index < 1000000; index++) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 7) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }

      users.push({
        id: v4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        first_name: result,
        last_name: result,
        email: result + "@mail.com",
        password: result,
        balance: 1000,
      })

      credentials.push({
        id: v4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: result,
        password: result,
        role_name: "supervisor",
        is_active: true,
      })
    }

    await queryInterface.bulkInsert('customers', users, {});
    await queryInterface.bulkInsert('credentials', credentials, {});

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
