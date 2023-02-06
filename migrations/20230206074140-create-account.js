'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
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
      account_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bank_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "banks",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      customer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "customers",
          key: "id"
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      },
      balance: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
    }, {
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ["bank_id", "customer_id", "deleted_at"]
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accounts');
  }
};