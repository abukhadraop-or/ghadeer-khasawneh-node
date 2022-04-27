const { validationResult } = require("express-validator/check");
const { Movie } = require("../models");

exports.getMovies = (req, res, next) => {
  Movie.findAll()
    .then((movies) => {
      res.status(200).json({ results: movies });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createMovie = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.original_title;
  const overview = req.body.overview;
  const posterPath = req.body.poster_path;
  const releaseDate = req.body.release_date;
  const voteCount = req.body.vote_count;
  const voteAverage = req.body.vote_average;

  const movie = new Movie({
    original_title: title,
    overview: overview,
    poster_path: posterPath,
    release_date: releaseDate,
    vote_count: voteCount,
    vote_average: voteAverage,
    userId: req.userId,
  });
  movie
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Movie added successfully!",
        movie: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateMovie = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const movieId = req.params.movieId;
  const title = req.body.original_title;
  const overview = req.body.overview;
  const posterPath = req.body.poster_path;
  const releaseDate = req.body.release_date;
  const voteCount = req.body.vote_count;
  const voteAverage = req.body.vote_average;

  Movie.findOne({ where: { id: movieId } })
    .then((movie) => {
      if (!movie) {
        const error = new Error("Could not find movie.");
        error.statusCode = 404;
        throw error;
      }
      if (movie.userId.toString() !== req.userId.toString()) {
        const error = new Error("You are not authorized!");
        error.statusCode = 403;
        throw error;
      }
      movie.original_title = title;
      movie.overview = overview;
      movie.poster_path = posterPath;
      movie.release_date = releaseDate;
      movie.vote_count = voteCount;
      movie.vote_average = voteAverage;
      return movie.save();
    })
    .then((result) => {
      res.status(200).json({ message: "MOvie Updated!", movie: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteMovie = (req, res, next) => {
  const movieId = req.params.movieId;

  Movie.findOne({ where: { id: movieId } })
    .then((movie) => {
      if (!movie) {
        const error = new Error("Could not find movie.");
        error.statusCode = 404;
        throw error;
      }
      if (movie.userId.toString() !== req.userId.toString()) {
        const error = new Error("You are not authorized!");
        error.statusCode = 403;
        throw error;
      }
      return Movie.destroy({ where: { id: movieId } });
    })
    .then((result) => {
      res.status(200).json({ message: "Movie deleted." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
