import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./config/firebase";

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observe user auth changes
    const unsubscribe = auth.onAuthStateChanged((user ) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Unsubscribe when component is unmounted
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // Optional loading indicator

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
