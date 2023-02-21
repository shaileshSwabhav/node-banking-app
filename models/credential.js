'use strict';
// const { v4 } = require("uuid")

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Credential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Credential.belongsTo(models.Customer, { foreignKey: 'id' })
    }
  }
  Credential.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    // role_id: DataTypes.UUID,
    role_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Credential',
    underscored: true,
    paranoid: true,
    tableName: "credentials",
  });

  // Credential.beforeCreate(cred => cred.id = v4())

  return Credential;
};