"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
    }
  }
  Movie.init(
    {
      original_title: DataTypes.STRING,
      overview: DataTypes.STRING,
      poster_path: DataTypes.STRING,
      release_date: DataTypes.STRING,
      vote_count: DataTypes.INTEGER,
      vote_average: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movie",
    }
  );
  return Movie;
};
