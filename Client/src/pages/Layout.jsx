import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";
import { useProfile } from "./ProfileContext";

const Layout = () => {
  const [username, setUsername] = useState("");
  const { profilePic, setProfilePic } = useProfile();

  useEffect(() => {
    const userId = 9; // Replace with actual user ID logic

    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((response) => {
        setUsername(response.data.username);
        if (response.data.profile_pic) {
          setProfilePic(response.data.profile_pic);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [setProfilePic]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-section">
          <div className="profile-icon">
            <img
              src={profilePic}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <h2 className="welcome-text">Welcome {username}!</h2>
        </div>
        <nav className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}>
            Transactions
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}>
            Settings
          </NavLink>
          <NavLink to="/" className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}>
            Logout
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
