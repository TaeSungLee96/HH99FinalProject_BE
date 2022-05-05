"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Time extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Time.hasOne(models.CountryName, {
        foreignKey: "timeId",
      });
    }
  }
  Time.init(
    {
      timeId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      standardTime: DataTypes.JSON,
      name: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Time",
    }
  );
  return Time;
};
