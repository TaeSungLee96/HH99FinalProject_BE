"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Target extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Target.belongsToMany(models.CountryName, {
        through: "Join",
        foreignKey: "targetId",
      });
    }
  }
  Target.init(
    {
      targetId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      targetName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Target",
    }
  );
  return Target;
};
