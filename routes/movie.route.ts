import express from "express";
import {
  postMovies,
  deleteMovies,
  getAllMovies,
  getMoviesById,
  putMovies,
  patchMovies,
} from "../controllers/movie.controller";
const router = express.Router();

router.get("/movies", getAllMovies);
router.get("/movies/:id", getMoviesById);
router.post("/movies", postMovies);
router.put("/movies/:id", putMovies);
router.patch("/movies/:id", patchMovies);
router.delete("/movies/:id", deleteMovies);

export default router;
