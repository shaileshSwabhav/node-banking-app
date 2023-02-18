'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('credentials', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
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
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // role_id: {
      //   type: Sequelize.UUID,
      //   allowNull: false,
      //   references: {
      //     model: "roles",
      //     key: "id"
      //   },
      //   onUpdate: "CASCADE",
      //   onDelete: "CASCADE",
      // },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('credentials');
  }
};