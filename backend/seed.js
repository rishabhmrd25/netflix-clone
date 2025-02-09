import { sequelize } from "./config/db.js";
import Movie from "./models/movie.model.js";

const seedMovies = async () => {
  try {
    await sequelize.sync({ force: true }); // Clears database and re-creates tables

    const movies = [
      {
        title: "Avengers",
        description: "A thief with the ability to enter people's dreams and steal secrets.",
        stream_url: "https://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
        thumbnail: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",

        category: "Sci-Fi",
      },
      {
        title: "The Dark Knight",
        description: "Batman faces the Joker, a criminal mastermind causing chaos in Gotham.",
        stream_url: "https://flipfit-cdn.akamaized.net/flip_hls/662aae7a42cd740019b91dec-3e114f/video_h1.m3u8",
        thumbnail: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        category: "Action",
      },
      {
        title: "Interstellar",
        description: "A group of astronauts travels through a wormhole to find a new home for humanity.",
        stream_url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        thumbnail: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        category: "Sci-Fi",
      },
      {
        title: "Parasite",
        description: "A poor family infiltrates a wealthy household with unexpected consequences.",
        stream_url: "https://flipfit-cdn.akamaized.net/flip_hls/664d87dfe8e47500199ee49e-dbd56b/video_h1.m3u8",
        thumbnail: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        category: "Thriller",
      },
    ];

    await Movie.bulkCreate(movies);

    console.log("Movies added successfully!");
    process.exit(); // Exit script after successful execution
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedMovies();
