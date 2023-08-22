import React from "react";
import { auth } from "../config/firebase";
import Logout from "./logout";
import logo from "../assets/logo.png";
import "../styles/profile.css";
import Sidebar from "./sidebar";
function UserProfile() {
  const displayName = auth.currentUser.displayName;
  const displayEmail = auth.currentUser.email;
  const displayPhoto = auth.currentUser.photoURL;

  return (
    <div>
      <Sidebar/>
      <div className="navbar">
        <img alt="applogo" className="applogo" src={logo} />
      </div>
      <div className="account-profile">
        <hr />

        <h2>Welcome to your Account, {displayName}!</h2>
        <div className="profile-section">
          <div className="profile-item">
            <p className="text-6">Email</p>
            <span className="text-6">{displayEmail}</span>
          </div>
          <div className="profile-item">
            <p className="text-6">Full Name</p>
            <span className="text-6">{displayName}</span>
          </div>
        </div>
        <img alt="profile" src={displayPhoto} className="" />
        <Logout />
        <hr />
      </div>
    </div>
  );
}
export default UserProfile;
