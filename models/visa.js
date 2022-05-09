"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Visa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Visa.hasOne(models.CountryName, {
        foreignKey: "visaId",
      });
    }
  }
  Visa.init(
    {
      visaId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      workVisa: DataTypes.JSON,
      immigrationVisa: DataTypes.JSON,
      workingHolidayVisa: DataTypes.JSON,
      studyVisa: DataTypes.JSON,
      name: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Visa",
    }
  );
  return Visa;
};
