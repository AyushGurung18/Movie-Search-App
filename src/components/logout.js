import React from "react";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function Logout() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
export default Logout;
