import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Signin from "./components/signin";
import Signup from "./components/signup";
import PrivateRoute from "./PrivateRoute";
import Home from "./components/home";
import PageNotFound from "./components/pagenotfound";
import { AuthProvider } from "./components/authContext";
import UserProfile from "./components/userProfile";
import PopularContent from "./components/popularcontent";
import TrendingContent from "./components/trendingcontent";
import UpcomingContent from "./components/upcomingcontent";
import NowPlayingContent from "./components/playingcontent";
import TopRatedContent from "./components/topratedcontent";
import MainApp from "./components/mainappcontent";
import SearchComponent from "./components/search";
import MovieDetailsComponent from "./components/movieInfo";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <MainApp />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchComponent />
              </PrivateRoute>
            }
          />
          <Route
            path="/userprofile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/popular"
            element={
              <PrivateRoute>
                <PopularContent />
              </PrivateRoute>
            }
          />
          <Route
            path="/trending"
            element={
              <PrivateRoute>
                <TrendingContent />
              </PrivateRoute>
            }
          />
          <Route
            path="/upcoming"
            element={
              <PrivateRoute>
                <UpcomingContent />
              </PrivateRoute>
            }
          />
          <Route
            path="/now-playing"
            element={
              <PrivateRoute>
                <NowPlayingContent />
              </PrivateRoute>
            }
          />
          <Route
            path="/top-rated"
            element={
              <PrivateRoute>
                <TopRatedContent />
              </PrivateRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <PrivateRoute>
                <MovieDetailsComponent />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
