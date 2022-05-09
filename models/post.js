"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Post.init(
    {
      postId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      country: DataTypes.STRING,
      target: DataTypes.STRING,
      postImageUrl: DataTypes.STRING,
      userName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
