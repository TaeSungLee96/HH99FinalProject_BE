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
      models.CountryName.belongsTo(models.Language, {
        foreignKey: "languageId",
      });
      models.CountryName.belongsTo(models.Time, {
        foreignKey: "timeId",
      });
      models.CountryName.belongsTo(models.Phone, {
        foreignKey: "phoneId",
      });
      models.CountryName.belongsTo(models.TrafficLaw, {
        foreignKey: "trafficId",
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
      languageId: DataTypes.INTEGER,
      timeId: DataTypes.INTEGER,
      bankId: DataTypes.INTEGER,
      phoneId: DataTypes.INTEGER,
      trafficId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CountryName",
    }
  );
  return CountryName;
};
