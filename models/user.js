"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Users.hasOne(models.Post, {
        foreignKey: "userId",
      });
      models.Users.hasOne(models.Comment, {
        foreignKey: "userId",
      });
    }
  }
  Users.init(
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
      modelName: "Users",
    }
  );
  return Users;
};
