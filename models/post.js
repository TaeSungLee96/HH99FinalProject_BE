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
      }),
        models.Post.hasMany(models.Comment, {
          foreignKey: "postId",
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
      userName: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      continent: DataTypes.STRING,
      subTitle: DataTypes.STRING,
      target: DataTypes.STRING,
      postImageUrl: DataTypes.STRING,
      viewCount: DataTypes.INTEGER,
      commentCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
