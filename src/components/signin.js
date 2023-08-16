import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import bgimage from "../assets/bg-image.jpg";
import "../styles/signin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function Signin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = JSON.parse(sessionStorage.getItem("user"));
    if (userFromStorage && !auth.currentUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("user", JSON.stringify(auth.currentUser));
      navigate("/dashboard");

    } catch {}
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      sessionStorage.setItem("user", JSON.stringify(auth.currentUser));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigate = () => {
    navigate("/signup");
  };

  return (
    <div className="body">
      <div className="image-container">
        <img alt="" src={bgimage} />
        <div className="overlay"></div>
      </div>
      <div className="form-input-box">
        <div className="form-input">
          <h1>Sign In</h1>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signIn}>Sign in</button>
          <button onClick={signInWithGoogle} style={{ background: "#4285F4" }}>
            <FontAwesomeIcon icon={faGoogle} />
            &nbsp; Sign in with Google
          </button>
          <p id="text-1">Need help?</p>
          <p id="text-2">New to NetSix?<span onClick={handleNavigate} style={{cursor:"pointer", color:"white"}}> Sign up now</span></p>
          <p id="text-3">This page is protected by Google reCAPTCHA to ensure you're not a bot.</p>
        </div>
      </div>
    </div>
  );
}
export default Signin;
