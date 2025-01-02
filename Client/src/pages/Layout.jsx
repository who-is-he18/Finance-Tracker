import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios"; // Make sure to install axios if you use it
import "../styles/Dashboard.css";

const Layout = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch username based on the logged-in user (replace with actual logic)
    const user_id = 9; // Example user ID, replace with actual user ID logic

    axios
      .get(`http://localhost:5000/api/users/${user_id}`) // Replace with the correct endpoint
      .then((response) => {
        setUsername(response.data.username); // Assuming `username` is in the response
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-section">
          <div className="profile-icon">
            <img
              src="/images/user-profile_5675125.png"
              alt="Profile"
              className="profile-image"
            />
          </div>
          <h2 className="welcome-text">Welcome {username}!</h2> {/* Displaying username */}
        </div>
        <nav className="nav-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
            Transactions
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
            Settings
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-button ${isActive ? "active" : ""}`
            }
          >
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
