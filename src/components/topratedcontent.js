import React, { useEffect, useState } from "react";
import { fetchTopRatedMovies, fetchTopRatedSeries } from "./MovieAPI";
import Sidebar from "./sidebar";
import LoadingScreen from "./loadingScreen";
import { useNavigate } from "react-router-dom";

function TopRatedContent() {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const topRatedMovies = await fetchTopRatedMovies();
        const topRatedSeries = await fetchTopRatedSeries();

        setTopRatedMovies(topRatedMovies.results);
        setTopRatedSeries(topRatedSeries.results);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
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
        <h1 className="content-info">Now Playing Movies</h1>

        {topRatedMovies.map((movie) => (
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
        <h1 className="content-info">Now Playing Series</h1>

        {topRatedSeries.map((series) => (
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
export default TopRatedContent;
