'use strict';
const { v4 } = require('uuid');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccountTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // AccountTransaction.belongsTo(models.Account, { foreignKey: "to_account_id" })
      AccountTransaction.belongsTo(models.Account, { foreignKey: "from_account_id" })
      AccountTransaction.belongsTo(models.Bank, { foreignKey: "bank_id" })
    }
  }
  AccountTransaction.init({
    from_account_id: DataTypes.UUID,
    to_account_id: DataTypes.UUID,
    amount: DataTypes.DOUBLE,
    date: DataTypes.DATE,
    type: DataTypes.STRING,
    bank_id: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'AccountTransaction',
    underscored: true,
    paranoid: true,
    tableName: "account_transactions"
  });

  AccountTransaction.beforeCreate(account => account.id = v4());

  return AccountTransaction;
};