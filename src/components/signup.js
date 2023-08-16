import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import bgimage from "../assets/bg-image.jpg";
// import "../styles/signin.css";

function Signup() {
  const [email, setEmail] = useState("");
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
      await createUserWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("user", JSON.stringify(auth.currentUser));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
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
