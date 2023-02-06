'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('banks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      full_name: {
        type: Sequelize.STRING
      },
      abbreviation: {
        type: Sequelize.STRING
      }
    }, {
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ["deleted_at", "abbreviation"]
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('banks');
  }
};