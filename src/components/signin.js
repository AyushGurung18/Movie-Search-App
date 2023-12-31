import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import bgimage from "../assets/bg-image.jpg";
import "../styles/signin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Footer from "./footer";

function Signin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = JSON.parse(sessionStorage.getItem("user"));
    if (userFromStorage && !auth.currentUser) {
      navigate("/home");
    }
  }, [navigate]);

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("user", JSON.stringify(auth.currentUser));
      navigate("/home");
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Wrong email or password. Please check your credentials.");
      } else {
        console.log(error);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      sessionStorage.setItem("user", JSON.stringify(auth.currentUser));
      navigate("/home")
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
            <button
              onClick={signInWithGoogle}
              style={{ background: "#4285F4" }}
            >
              <FontAwesomeIcon icon={faGoogle} />
              &nbsp; Sign in with Google
            </button>
            <p id="text-1">Need help?</p>
            <p id="text-2">
              New to Bayflix? &nbsp;
              <span
                onClick={handleNavigate}
                style={{ cursor: "pointer", color: "white" }}
              >
                Sign up now
              </span>
            </p>
            <p id="text-3">
              This page is protected by Google reCAPTCHA to ensure you're not a
              bot.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
export default Signin;
