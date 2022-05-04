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
    }
  }
  TrafficLaw.init(
    {
      trafficId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      trafficLaw: DataTypes.JSON,
      countryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TrafficLaw",
    }
  );
  return TrafficLaw;
};
