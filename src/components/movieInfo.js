import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingScreen from "./loadingScreen";
import Sidebar from "./sidebar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      <div className="movie-section">
        <div className="hero-container">
          <div className="background-black"></div>
          <div className="hero">
            <div className="hero-details">
              <h1 className="hero-title">{movieData?.title}</h1>
              <p className="">{movieData?.release_date}</p>
              <p className="">{movieData?.overview}</p>
            </div>
            <div className="gradient-effect"></div>
            <img
              alt={movieData.title}
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`}
            />
          </div>
        </div>
        <div className="movie-info">
          <div className="">
            <img
              alt={movieData.title}
              src={`https://image.tmdb.org/t/p/w300${movieData.poster_path}`}
            />
          </div>
          <div className="details-overview">
            <div className="">
              <h1 className="cell">Storyline</h1>
              <p className="cell">{movieData?.overview}</p>
            </div>
            <table>
              <tr className="Details-TableData">
                <td className="cell">Release</td>
                <td className="cell">{movieData.release_date}</td>
              </tr>
              <tr className="Details-TableData">
                <td className="cell">Runtime</td>
                <td className="cell">{movieData.runtime}</td>
              </tr>
              <tr className="Details-TableData">
                <td className="cell">Budget</td>
                <td className="cell">${movieData.budget}</td>
              </tr>
              <tr className="Details-TableData">
                <td className="cell">Revenue</td>
                <td className="cell">${movieData.revenue}</td>
              </tr>
              <tr className="Details-TableData">
                <td className="cell">Language</td>
                <td className="cell">{movieData.spoken_languages[0].name}</td>
              </tr>
              <tr className="Details-TableData">
                <td className="cell">Genres</td>
                <td className="cell">
                  {movieData.genres.map((genre, index) => (
                    <span key={index}>
                      {genre.name}
                      {index !== movieData.genres.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
