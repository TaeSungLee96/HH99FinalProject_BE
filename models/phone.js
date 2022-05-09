"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Phone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Phone.hasOne(models.CountryName, {
        foreignKey: "phoneId",
      });
    }
  }
  Phone.init(
    {
      phoneId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      phoneOpeningMethod: DataTypes.JSON,
      mainTelecom: DataTypes.JSON,
      recommendPlan: DataTypes.JSON,
      name: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Phone",
    }
  );
  return Phone;
};
