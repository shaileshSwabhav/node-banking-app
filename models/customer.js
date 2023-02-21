'use strict';
const { v4 } = require('uuid');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.hasMany(models.Account, { foreignKey: "customer_id", })
      Customer.hasOne(models.Credential, { foreignKey: "id", })
    }
  }
  Customer.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    balance: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Customer',
    underscored: true,
    paranoid: true,
    tableName: "customers"
  });

  // Customer.beforeCreate(customer => customer.id = v4());
  Customer.beforeCreate(customer => customer.id = v4());

  return Customer;
};