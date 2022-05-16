"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BaseInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.BaseInfo.hasOne(models.Join, {
        foreignKey: "baseInfoId",
      });
    }
  }
  BaseInfo.init(
    {
      baseInfoId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      countryName: DataTypes.JSON,
      baseInfo: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "BaseInfo",
    }
  );
  return BaseInfo;
};
