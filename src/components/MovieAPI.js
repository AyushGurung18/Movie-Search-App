const apiKey = process.env.REACT_APP_BASE_KEY;
const baseUrl = process.env.REACT_APP_BASE_URL;

async function fetchApi(endpoint) {
  try {
    const response = await fetch(`${baseUrl}/3${endpoint}?api_key=${apiKey}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

export function fetchPopularMovies() {
  return fetchApi("/movie/popular");
}

export function fetchPopularSeries() {
  return fetchApi("/tv/popular");
}

export function fetchTrendingMovies() {
  return fetchApi("/trending/movie/day");
}

export function fetchTrendingSeries() {
  return fetchApi("/trending/tv/day");
}

export function fetchUpcomingMovies() {
  return fetchApi("/movie/upcoming");
}

export function fetchUpcomingSeries() {
  return fetchApi("/tv/on_the_air");
}

export function fetchNowPlayingMovie() {
  return fetchApi("/movie/now_playing");
}

export function fetchNowPlayingSeries() {
  return fetchApi("/tv/airing_today");
}

export function fetchTopRatedSeries() {
  return fetchApi("/tv/top_rated");
}

export function fetchTopRatedMovies() {
  return fetchApi("/movie/top_rated");
}

export function fetchMovieDetails(movieId) {
  return fetchApi(`/movie/${movieId}`)
}
