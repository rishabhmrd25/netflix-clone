import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Componets/Footer/Footer";
import { AuthContext } from "../Context/AuthContext";

import axios from "axios";

function Home() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredMovies, setFilteredMovies] = useState([]);
    const { subscribed } = useContext(AuthContext);
  const navigate = useNavigate();

  const getMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/movie/movies");
      const fetchedMovies = response.data.content || [];
      setMovies(fetchedMovies);
      extractCategories(fetchedMovies);
      setFilteredMovies(fetchedMovies); // Show all movies initially
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const extractCategories = (movies) => {
    const fetchedCategories = new Set(
      movies.flatMap((movie) => (Array.isArray(movie.category) ? movie.category : [movie.category]))
    );
    setCategories(["All", ...fetchedCategories]);
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    const filterMovies = () => {
      if (selectedCategory === "All") {
        return movies;
      }
      return movies.filter((movie) => movie.category === selectedCategory);
    };
    setFilteredMovies(filterMovies());
  }, [selectedCategory, movies]);

  const openMoviePlayer = (streamUrl) => {
    navigate(`/player?url=${encodeURIComponent(streamUrl)}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header Section */}
      <div className="mt-20 text-center text-white flex-grow">
        <div className="flex justify-between items-center px-6">
          <h1 className="text-4xl font-bold mb-4">Featured Movies</h1>
          {/* Subscribe Button */}
          {!subscribed && <button
            onClick={() => navigate("/subscribe")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
          >
            Subscribe Now
          </button>}
        </div>

        {/* Category Filter Dropdown */}
        <div className="mb-6">
          <select
            className="bg-gray-700 text-white px-4 py-2 rounded-md cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 mb-20">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="cursor-pointer relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                onClick={() => openMoviePlayer(movie.stream_url)}
              >
                <div
                  className="w-full h-80 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${movie.thumbnail})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4">
                    <p className="text-lg font-bold text-white">{movie.title}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg">No movies found.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
