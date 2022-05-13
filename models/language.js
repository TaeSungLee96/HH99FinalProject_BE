"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Language.hasOne(models.CountryName, {
        foreignKey: "languageId",
      });
    }
  }
  Language.init(
    {
      languageId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: DataTypes.JSON,
      info: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Language",
    }
  );
  return Language;
};
