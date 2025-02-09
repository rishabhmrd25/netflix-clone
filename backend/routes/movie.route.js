import express from "express";
import { getAllMovies } from "../controllers/movie.controller.js";

const router = express.Router();

// Route to fetch all movies
router.get("/movies", getAllMovies);

export default router;
