"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Continent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Continent.init(
    {
      continentId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      continentName: DataTypes.STRING,
      targetId: DataTypes.INTEGER,
      purpose: DataTypes.STRING,
      info: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Continent",
    }
  );
  return Continent;
};
