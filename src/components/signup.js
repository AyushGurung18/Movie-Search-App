import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import bgimage from "../assets/bg-image.jpg";

function Signup() {
  const location = useLocation();

  const preFilledEmail = location.state?.email || "";

  const [email, setEmail] = useState(preFilledEmail);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/signin");
  };

  console.log(auth?.currentUser?.email);

  useEffect(() => {
    const userFromStorage = JSON.parse(sessionStorage.getItem("user"));
    if (userFromStorage && !auth.currentUser) {
      console.log(userFromStorage);
      navigate("/dashboard");
    }
  }, [navigate]);

  const signUp = async () => {
    try {
      if (isValidEmail(email) && isValidPassword(password)) {
        await createUserWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem("user", JSON.stringify(auth.currentUser));
        navigate("/dashboard");
      } else if (!isValidEmail(email)) {
        alert("Please enter a Valid email");
      } else if (!isValidPassword(password)) {
        alert("Please must contain 6 letters.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const isValidPassword = async (password) => {
    return password.length >= 6;
  };

  return (
    <div className="body">
      <div className="image-container">
        <img alt="" src={bgimage} />
        <div className="overlay"></div>
      </div>
      <div className="form-input-box">
        <div className="form-input">
          <h1>Sign Up</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signUp}>Sign up</button>
          <p id="text-1">Need help?</p>
          <p id="text-2">
            Have an Account? &nbsp;
            <span
              onClick={handleNavigate}
              style={{ cursor: "pointer", color: "white" }}
            >
              Sign in now
            </span>
          </p>
          <p id="text-3">
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot.
          </p>
        </div>
      </div>
    </div>
  );
}
export default Signup;
