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

    await queryInterface.bulkInsert('roles', [{
      id: v4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role_name: "admin"
    }, {
      id: v4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role_name: "manager"
    }, {
      id: v4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role_name: "supervisor"
    }], {});
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
