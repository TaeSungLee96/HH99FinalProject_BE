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
      bankRequirePaper: DataTypes.JSON(999999),
      mainBank: DataTypes.JSON(999999),
      bankStep: DataTypes.JSON(999999),
      bankCaution: DataTypes.JSON(999999),
      accountType: DataTypes.JSON(999999),
    },
    {
      sequelize,
      modelName: "Bank",
    }
  );
  return Bank;
};
