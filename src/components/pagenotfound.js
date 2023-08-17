import React from "react";
import "../styles/pagenotfound.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function PageNotFound() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="notfound-image">
      <div className="pagenotfound">
        <h2 className="header-1">Lost your Way?</h2>
        <p className="text-5">
          Sorry, we can't find that page. You'll find lots to explore on the
          home page
        </p>
        <p className="text-5">Error Code 404</p>
        <button onClick={handleClick}>Bayflix Home</button>
      </div>
    </div>
  );
}

export default PageNotFound;
