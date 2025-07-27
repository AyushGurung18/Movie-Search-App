import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import LoadingScreen from "./loadingScreen";

const TVInfo = () => {
  const { id } = useParams();
  const [tvData, setTvData] = useState(null);

  const apiKey = process.env.REACT_APP_BASE_KEY;
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    async function fetchTVData() {
      try {
        const response = await fetch(`${baseUrl}/3/tv/${id}?api_key=${apiKey}`);
        const data = await response.json();
        setTvData(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTVData();
  }, [id]);

  if (!tvData) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Sidebar />
      <div className="movie-section">
        <div className="hero-container">
          <div className="background-black"></div>
          <div className="hero">
            <div className="hero-details">
              <h1 className="hero-title">{tvData.name}</h1>
              <p className="hero-para">{tvData.first_air_date}</p>
              <p className="hero-para">{tvData.overview}</p>
            </div>
            <div className="gradient-effect"></div>
            <img
              alt={tvData.name}
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w1280${tvData.backdrop_path}`}
            />
          </div>
        </div>
        <div className="movie-info">
          <div className="">
            <img
              className="img-poster"
              alt={tvData.name}
              src={`https://image.tmdb.org/t/p/w300${tvData.poster_path}`}
            />
          </div>
          <div className="details-overview">
            <h1 className="cell">Storyline</h1>
            <p className="cell">{tvData.overview}</p>
            <table>
              <tbody>
                <tr className="Details-TableData">
                  <td className="cell">First Air Date</td>
                  <td className="cell">{tvData.first_air_date}</td>
                </tr>
                <tr className="Details-TableData">
                  <td className="cell">Episodes</td>
                  <td className="cell">{tvData.number_of_episodes}</td>
                </tr>
                <tr className="Details-TableData">
                  <td className="cell">Seasons</td>
                  <td className="cell">{tvData.number_of_seasons}</td>
                </tr>
                <tr className="Details-TableData">
                  <td className="cell">Genres</td>
                  <td className="cell">
                    {tvData.genres.map((genre, index) => (
                      <span key={index}>
                        {genre.name}
                        {index !== tvData.genres.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVInfo;
