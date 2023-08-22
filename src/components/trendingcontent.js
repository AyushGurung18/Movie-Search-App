import React, { useState, useEffect } from "react";
import { fetchTrendingMovies, fetchTrendingSeries } from "./MovieAPI";
import "../styles/movie.css";
import Sidebar from "./sidebar";
import LoadingScreen from "./loadingScreen";

function TrendingContent() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const trendingMovies = await fetchTrendingMovies();
        const trendingSeries = await fetchTrendingSeries();

        setTrendingMovies(trendingMovies.results);
        setTrendingSeries(trendingSeries.results);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }
  return (
    <div>
      <Sidebar />
      <div className="movie-section">
        <h1 className="content-info">Trending Series</h1>

        {trendingMovies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-info">Release Date: {movie.release_date}</p>
          </div>
        ))}
        <h1 className="content-info">Trending Series</h1>

        {trendingSeries.map((series) => (
          <div className="movie-card" key={series.id}>
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w300${series.poster_path}`}
              alt={series.title}
            />
            <h3 className="movie-title">{series.original_name}</h3>
            <p className="movie-info">Release Date: {series.first_air_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default TrendingContent;
