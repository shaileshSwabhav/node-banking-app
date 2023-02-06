'use strict';
const { v4 } = require('uuid');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bank.init({
    full_name: DataTypes.STRING,
    abbreviation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bank',
    underscored: true,
    paranoid: true,
    tableName: 'banks'
  });

  Bank.beforeCreate(bank => bank.id = v4());

  return Bank;
};