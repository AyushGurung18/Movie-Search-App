import React from "react";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import {
  faHome,
  faCalendarDays,
  faSearch,
  faTv,
  faClapperboard,
  faHeart,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/sidebar.css";

function Sidebar() {
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
    navigate("/favourite");
  }
  function handleClick6() {
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
          <li className="sidebar-list-item" onClick={handleClick}>
            <FontAwesomeIcon icon={faSearch} className="sidebar-icons" />
          </li>
          <li
            className="sidebar-list-item"
            data-action="popular"
            onClick={handleClick1}
          >
            <FontAwesomeIcon icon={faHome} className="sidebar-icons" />
          </li>
          <li className="sidebar-list-item" onClick={handleClick2}>
            <FontAwesomeIcon icon={faCalendarDays} className="sidebar-icons" />
          </li>
          <li className="sidebar-list-item" onClick={handleClick3}>
            <FontAwesomeIcon icon={faTv} className="sidebar-icons" />
          </li>
          <li className="sidebar-list-item" onClick={handleClick4}>
            <FontAwesomeIcon icon={faClapperboard} className="sidebar-icons" />
          </li>
          <li className="sidebar-list-item" onClick={handleClick5}>
            <FontAwesomeIcon icon={faHeart} className="sidebar-icons" />
          </li>
          <li className="sidebar-list-item" onClick={handleClick6}>
            <FontAwesomeIcon icon={faStar} className="sidebar-icons" />
          </li>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
