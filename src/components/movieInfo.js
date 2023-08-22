import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingScreen from "./loadingScreen";
import Sidebar from "./sidebar";

const MovieInfo = () => {
  const { id } = useParams();
  const [movieData, setMovieData] = useState(null);

  const apiKey = "7ad4552f2438c7ea8e09aeabc10df108";
  const baseUrl = "https://api.themoviedb.org";

  useEffect(() => {
    async function fetchMovieData() {
      try {
        const response = await fetch(
          `${baseUrl}/3/movie/${id}?api_key=${apiKey}`
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchMovieData();
  }, [id]);

  if (!movieData) {
    return (
      <p>
        <LoadingScreen />
      </p>
    );
  }

  return (
    <div>
      <Sidebar />
      <div className="mainapp-component">
        <div className="hero-container">
          <div className="background-black"></div>
          <div className="hero">
            <div className="hero-details">
              <h1 className="hero-title">{movieData?.title}</h1>
              <p className="">{movieData?.release_date}</p>
              <p className="">{movieData?.overview}</p>
              <button>More Info</button>
            </div>
            <div className="gradient-effect"></div>
            <img
              alt={movieData.title}
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`}
            />
          </div>
        </div>
      </div>
      <div className="">
        <div>
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w300${movieData.poster_path}`}
            alt={movieData.title}
            loading="lazy"
          />
          <div>
            <h1>Storyline</h1>
            <p>{movieData.overview}</p>
            <p>Release Date{movieData.release_date}</p>
            <p>Revenue Generated{movieData.revenue}</p>
            <p>Budget {movieData.budget}</p>
            <p>Runtime{movieData.runtime}</p>
            <p>Origin Country{movieData.origin_country}</p>
            <p>Status{movieData.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
