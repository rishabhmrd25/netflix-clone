import Movie from "../models/movie.model.js";

export async function getAllMovies(req, res) {
	try {
		const movies = await Movie.findAll();
		res.status(200).json({ success: true, content: movies });
	} catch (error) {
		console.error("Error fetching movies:", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}
