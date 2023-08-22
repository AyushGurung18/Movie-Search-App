import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  fetchPopularMovies,
  fetchMovieDetails,
  fetchNowPlayingMovie,
  fetchUpcomingMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
} from "./MovieAPI"; 
import Sidebar from "./sidebar";
import "../styles/mainapp.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingScreen from "./loadingScreen";
import { useNavigate } from "react-router-dom";

function MainApp() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [heroBackdrop, setHeroBackdrop] = useState(null);
  const [heroMovie, setHeroMovie] = useState(null); 
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [nowPlayingMovie, setNowPlayingMovie] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          topRatedMoviesData,
          trendingMoviesData,
          upcomingMoviesData,
          nowPlayingMoviesData,
          popularMoviesData,
        ] = await Promise.all([
          fetchTopRatedMovies(),
          fetchTrendingMovies(),
          fetchUpcomingMovies(),
          fetchNowPlayingMovie(),
          fetchPopularMovies(),
        ]);

        setTopRatedMovies(topRatedMoviesData.results);
        setTrendingMovies(trendingMoviesData.results);
        setUpcomingMovies(upcomingMoviesData.results);
        setNowPlayingMovie(nowPlayingMoviesData.results);
        setPopularMovies(popularMoviesData.results);

        if (popularMoviesData.results.length > 0) {
          const firstMovie = popularMoviesData.results[0];
          const firstMovieDetails = await fetchMovieDetails(firstMovie.id);

          setHeroBackdrop(firstMovieDetails.backdrop_path);
          setHeroMovie(firstMovieDetails);
        }

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Adjust the number of slides to show based on screen width
      if (window.innerWidth > 1000) {
        setSlidesToShow(7);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const settings = {
    dots: false, // Show navigation dots
    infinite: false, // Loop through the carousel
    speed: 500, // Transition speed in milliseconds
    slidesToShow: slidesToShow, // Number of slides to show at once
    slidesToScroll: 6, // Number of slides to scroll when navigating
  };

  const handleClick = (e) => {
    const action = e.target.getAttribute("data-action");

    if (action === "popularmovie") {
      navigate(`/popular`);
    } else if (action === "trendinghome") {
      navigate("/trending");
    } else if (action === "playingmovie") {
      navigate("/now-playing");
    } else if (action === "topratedmovie") {
      navigate("/top-rated");
    } else if (action === "upcomingmovie") {
      navigate("/upcoming");
    }
  };

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
      <div className="mainapp-component">
        <div className="hero-container">
          <div className="background-black"></div>
          <div className="hero">
            <div className="hero-details">
              <h1 className="hero-title">{heroMovie?.title}</h1>
              <p className="">{heroMovie?.release_date}</p>
              <p className="">{heroMovie?.overview}</p>
              <button>More Info</button>
            </div>
            <div className="gradient-effect"></div>
            <img
              alt={heroMovie.title}
              loading="lazy"
              src={`https://image.tmdb.org/t/p/original${heroBackdrop}`}
            />
          </div>
        </div>
        <div className="movie-section">
          <h1 className="section-info">
            Popular Movies{" "}
            <span
              className="text-7"
              data-action="popularmovie"
              onClick={handleClick}
            >
              {" "}
              Explore All
            </span>
          </h1>
          <Slider {...settings}>
            {popularMovies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <img
                  className="movie-poster"
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  loading="lazy"
                />
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-info">Release Date: {movie.release_date}</p>
              </div>
            ))}
          </Slider>
        </div>
        <div className="movie-section">
          <h1 className="section-info">
            Now Playing Movies{" "}
            <span
              className="text-7"
              data-action="playingmovie"
              onClick={handleClick}
            >
              {" "}
              Explore All
            </span>
          </h1>
          <Slider {...settings}>
            {nowPlayingMovie.map((movie) => (
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
          </Slider>
        </div>
        <div className="movie-section">
          <h1 className="section-info">
            {" "}
            Upcoming Movies{" "}
            <span
              className="text-7"
              data-action="upcomingmovie"
              onClick={handleClick}
            >
              {" "}
              Explore All
            </span>
          </h1>
          <Slider {...settings}>
            {upcomingMovies.map((movie) => (
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
          </Slider>
        </div>
        <div className="movie-section">
          <h1 className="section-info">
            Trending Movies{" "}
            <span
              className="text-7"
              data-action="trendingmovie"
              onClick={handleClick}
            >
              {" "}
              Explore All
            </span>
          </h1>
          <Slider {...settings}>
            {trendingMovies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <img
                  className="movie-poster"
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
                <h3 className="movie-title">{movie.title} </h3>
                <p className="movie-info">Release Date: {movie.release_date}</p>
              </div>
            ))}
          </Slider>
        </div>
        <div className="movie-section">
          <h1 className="section-info">
            Top Rated Movies{" "}
            <span
              className="text-7"
              data-action="topratedmovie"
              onClick={handleClick}
            >
              {" "}
              Explore All
            </span>
          </h1>
          <Slider {...settings}>
            {topRatedMovies.map((movie) => (
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
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default MainApp;
