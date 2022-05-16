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
        as: "info",
      });
      models.Join.belongsTo(models.Target, {
        foreignKey: "targetId",
      });
      models.Join.belongsTo(models.TotalVisa, {
        foreignKey: "totalVisaId",
        as: "visa",
      });
      models.Join.belongsTo(models.BaseInfo, {
        foreignKey: "baseInfoId",
      });
    }
  }
  Join.init(
    {
      targetId: DataTypes.INTEGER,
      countryId: DataTypes.INTEGER,
      targetName: DataTypes.STRING,
      countryName: DataTypes.STRING,
      purpose: DataTypes.STRING,
      service: DataTypes.STRING,
      purposeEng: DataTypes.STRING,
      flag: DataTypes.STRING,
      totalVisaId: DataTypes.INTEGER,
      BaseInfoId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Join",
    }
  );
  return Join;
};
