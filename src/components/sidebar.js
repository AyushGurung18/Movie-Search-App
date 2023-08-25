import React from "react";
import { auth } from "../config/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import {
  faHome,
  faCalendarDays,
  faSearch,
  faTv,
  faClapperboard,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/sidebar.css";

function Sidebar() {
  const location = useLocation();

  const displayPhoto = auth.current ? auth.currentUser.photoURL : null;
  const navigate = useNavigate();

  function handleClickpUser() {
    navigate("/userprofile");
  }

  function handleClick() {
    navigate("/search");
  }
  function handleClick1() {
    navigate("/home");
  }
  function handleClick2() {
    navigate("/upcoming");
  }
  function handleClick3() {
    navigate("/now-playing");
  }
  function handleClick4() {
    navigate("/popular");
  }

  function handleClick5() {
    navigate("/top-rated");
  }

  return (
    <div>
      <div className="sidebar">
        <div onClick={handleClickpUser} className="user-profile-icon">
          {displayPhoto ? (
            <img src={displayPhoto} alt="User Profile" />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
        </div>
        <div className="sidebar-list">
          <li
            className={`sidebar-list-item ${
              location.pathname === "/search" ? "active" : ""
            }`}
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faSearch} className="sidebar-icons" />
          </li>
          <li
            className={`sidebar-list-item ${
              location.pathname === "/home" ? "active" : ""
            }`}
            onClick={handleClick1}
          >
            <FontAwesomeIcon icon={faHome} className="sidebar-icons" />
          </li>
          <li
            className={`sidebar-list-item ${
              location.pathname === "/upcoming" ? "active" : ""
            }`}
            onClick={handleClick2}
          >
            <FontAwesomeIcon icon={faCalendarDays} className="sidebar-icons" />
          </li>
          <li
            className={`sidebar-list-item ${
              location.pathname === "/now-playing" ? "active" : ""
            }`}
            onClick={handleClick3}
          >
            <FontAwesomeIcon icon={faTv} className="sidebar-icons" />
          </li>
          <li
            className={`sidebar-list-item ${
              location.pathname === "/popular" ? "active" : ""
            }`}
            onClick={handleClick4}
          >
            <FontAwesomeIcon icon={faClapperboard} className="sidebar-icons" />
          </li>

          <li
            className={`sidebar-list-item ${
              location.pathname === "/top-rated" ? "active" : ""
            }`}
            onClick={handleClick5}
          >
            <FontAwesomeIcon icon={faStar} className="sidebar-icons" />
          </li>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
