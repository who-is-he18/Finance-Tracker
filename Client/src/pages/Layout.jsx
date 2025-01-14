import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Layout.css";

const Layout = () => {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("/images/user-profile_5675125.png");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const userId = localStorage.getItem("user_id"); // Retrieve user ID from local storage
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    axios
      .get(`https://pennywise-backend-gywb.onrender.com/api/users/${userId}`)
      .then((response) => {
        setUsername(response.data.username);
        if (response.data.profile_pic) {
          setProfilePic(response.data.profile_pic);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    navigate("/login"); // Redirect to login page
  };

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
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
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