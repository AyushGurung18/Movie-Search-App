import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";

const API_KEY = process.env.REACT_APP_BASE_KEY;
const baseUrl = process.env.REACT_APP_BASE_URL;

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [seriesResults, setSeriesResults] = useState([]);
  const [movieResults, setMovieResults] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const search = async () => {
      try {
        if (searchQuery.trim() === "") {
          setSeriesResults([]);
          setMovieResults([]);
          return;
        }

        const seriesResponse = await fetch(
          `${baseUrl}/3/search/tv?api_key=${API_KEY}&query=${searchQuery}`
        );
        const seriesData = await seriesResponse.json();
        console.log(seriesData);
        
        setSeriesResults(seriesData.results);

        const movieResponse = await fetch(
          `${baseUrl}/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`
        );
        const movieData = await movieResponse.json();
        setMovieResults(movieData.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div>
      <div className="movie-section">
        <Sidebar />
        <input
          type="text"
          placeholder="Search for movies and series..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <ul>
            {movieResults.map((movie) => (
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
                <p className="movie-info"> {movie.vote_average}/10</p>
              </div>
            ))}
          </ul>
        </div>
        <div>
          <ul>
            {seriesResults.map((series) => (
              <div
                className="movie-card"
                key={series.id}
                onClick={() => navigate(`/tv/${series.id}`)}
              >
              <img
                  className="movie-poster"
                  src={
                    series.poster_path
                      ? `https://image.tmdb.org/t/p/w300${series.poster_path}`
                      : "/fallback-image.jpg"
                  }
                  alt={series.name || series.original_name}
                />
                <h3 className="movie-title">{series.original_name}</h3>
                <p className="movie-info">
                  First Air Date: {series.first_air_date}
                </p>
                <p className="movie-info"> {series.vote_average}/10</p>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
