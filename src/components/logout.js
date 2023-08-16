import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

function Logout() {
  const logout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("user");
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
