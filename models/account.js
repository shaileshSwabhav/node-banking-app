'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Account.hasOne(models.Bank, { foreignKey: "bank_id" })
    }
  }
  Account.init({
    account_name: DataTypes.STRING,
    bank_id: DataTypes.UUID,
    customer_id: DataTypes.UUID,
    balance: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Account',
    underscored: true,
    paranoid: true,
    tableName: 'accounts',
  });
  return Account;
};