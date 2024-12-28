import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../styles/Dashboard.css";

const Layout = () => {
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
          <h2 className="welcome-text">Welcome {`{Username}`}!</h2>
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
        `nav-button ${isActive? "active" : ""}`}
          >Logout</NavLink>
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
