import React, { useState } from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { auth } from "../config/firebase";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import Footer from "./footer";

function Home() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleClick = () => navigate("/signin");
  const handleClick2 = async () => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
    } else {
      try {
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
          alert("This email is already registered. Please sign in.");
        } else {
          navigate("/signup", { replace: true, state: { email } });
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  return (
    <div className="background-container">
      <div className="overlay"></div>
      <div className="content">
        <div className="navbar">
          <div className="nav-item">
            <img className="logo" src={logo} alt="Logo" />
            <button onClick={handleClick} className="nav-button">
              Sign In
            </button>
          </div>
        </div>
        <div className="main-content">
          <h1 className="heading">Unlimited movies, TV shows and more.</h1>
          <p id="text-4">Watch anywhere. Cancel anytime.</p>
          <p id="text-4">Ready to watch? Create your account now.</p>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Your Email"
            type="text"
          ></input>
          <button onClick={handleClick2}>Signup</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
export default Home;
