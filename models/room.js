"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Room.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      room: DataTypes.STRING,
      author: DataTypes.STRING,
      authorId: DataTypes.INTEGER,
      targetAuthor: DataTypes.STRING,
      targetAuthorId: DataTypes.INTEGER,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
