import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";

function Dashboard() {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovieList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };

    getMovieList();
  }, []); // Empty dependency array ensures the effect runs only on component mount

  return (
    <div className="App">
      {/* Display movie data */}
      <ul>
        {movieList.map((movie) => (
          <div>
            <h1 style={{ color: movie.receivedAnOscar ? "#BF953F" : "black" }}>
              {movie.title}
            </h1>
            <p>release Date = {movie.releaseDate}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
