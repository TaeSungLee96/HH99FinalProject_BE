"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CountryName extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.CountryName.belongsTo(models.Bank, {
        foreignKey: "bankId",
      });
      models.CountryName.belongsToMany(models.Target, {
        through: "Join",
        foreignKey: "countryId",
      });
    }
  }
  CountryName.init(
    {
      countryId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      countryName: DataTypes.STRING,
      bankId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CountryName",
    }
  );
  return CountryName;
};
