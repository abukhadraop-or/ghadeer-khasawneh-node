const express = require("express");
const { body } = require("express-validator/check");
const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/movies", feedController.getMovies);

router.post(
  "/movie",
  isAuth,
  [body("original_title").trim().isLength({ min: 3 })],
  feedController.createMovie
);
router.put(
  "/movie/:movieId",
  isAuth,
  [body("original_title").trim().isLength({ min: 3 })],
  feedController.updateMovie
);

router.delete("/movie/:movieId", isAuth, feedController.deleteMovie);

module.exports = router;
