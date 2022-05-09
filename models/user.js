"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasOne(models.Post, {
        foreignKey: "userId",
      });
      models.User.hasOne(models.Comment, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      userId: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      userName: DataTypes.STRING,
      userImageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
