"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Bank.hasOne(models.CountryName, {
        foreignKey: "bankId",
      });
    }
  }
  Bank.init(
    {
      bankId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.JSON,
      info: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Bank",
    }
  );
  return Bank;
};
