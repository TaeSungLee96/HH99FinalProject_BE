"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TotalVisa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.TotalVisa.hasOne(models.Join, {
        foreignKey: "totalVisaId",
      });
    }
  }
  TotalVisa.init(
    {
      totalVisaId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.JSON,
      category: DataTypes.JSON,
      countryName: DataTypes.JSON,
      info: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "TotalVisa",
    }
  );
  return TotalVisa;
};
