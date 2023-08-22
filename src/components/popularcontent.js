import React, { useEffect, useState } from "react";
import { fetchPopularMovies, fetchPopularSeries } from "./MovieAPI";
import "../styles/movie.css";
import Sidebar from "./sidebar";
import LoadingScreen from "./loadingScreen";
import { useNavigate } from "react-router-dom";

function PopularContent() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate  = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const popularMovies = await fetchPopularMovies();
        const popularSeries = await fetchPopularSeries();

        setPopularMovies(popularMovies.results);
        setPopularSeries(popularSeries.results);
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
        <h1 className="content-info">Popular Movies</h1>
        {popularMovies.map((movie) => (
          <div
            className="movie-card"
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-info">Release Date: {movie.release_date}</p>
          </div>
        ))}
        <h1 className="content-info">Popular Series</h1>
        {popularSeries.map((series) => (
          <div className="movie-card" key={series.id}>
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w300${series.poster_path}`}
              alt={series.title}
            />
            <h3 className="movie-title">{series.original_name}</h3>
            <p className="movie-info">
              First Air Date: {series.first_air_date}
            </p>
            <p className="movie-info"> {series.vote_average}/10</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PopularContent;
