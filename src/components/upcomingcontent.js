import React, { useEffect, useState } from "react";
import { fetchUpcomingMovies, fetchUpcomingSeries } from "./MovieAPI";
import Sidebar from "./sidebar";
import "../styles/movie.css";
import LoadingScreen from "./loadingScreen";
import { useNavigate } from "react-router-dom";

function UpcomingContent() {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [upcomingSeries, setUpcomingSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const upcomingMovies = await fetchUpcomingMovies();
        const upcomingSeries = await fetchUpcomingSeries();

        setUpcomingMovies(upcomingMovies.results);
        setUpcomingSeries(upcomingSeries.results);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
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

        {upcomingMovies.map((movie) => (
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
        <h1 className="content-info">Trending Series</h1>

        {upcomingSeries.map((series) => (
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
export default UpcomingContent;
