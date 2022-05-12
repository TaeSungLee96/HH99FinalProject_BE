"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TrafficLaw extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.TrafficLaw.hasOne(models.CountryName, {
        foreignKey: "trafficId",
      });
    }
  }
  TrafficLaw.init(
    {
      trafficId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.JSON,
      info: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "TrafficLaw",
    }
  );
  return TrafficLaw;
};
