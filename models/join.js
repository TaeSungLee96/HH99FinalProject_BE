"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Join extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Join.belongsTo(models.CountryName, {
        foreignKey: "countryId",
      });
      models.Join.belongsTo(models.Target, {
        foreignKey: "targetId",
      });
    }
  }
  Join.init(
    {
      targetId: DataTypes.INTEGER,
      countryId: DataTypes.INTEGER,
      targetName: DataTypes.STRING,
      countryName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Join",
    }
  );
  return Join;
};
