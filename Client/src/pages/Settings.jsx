import React, { useState, useEffect } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme; // Apply theme class to body
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme preference
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  return (
    <div className="settings-container">
      {/* Main Content */}
      <main className="settings-main">
        {/* Account Settings Section */}
        <section className="account-settings">
          <h2 className="section-title">Account Settings</h2>
          <div className="input-group">
            <label>Update Email</label>
            <input type="email" placeholder="Enter new email" />
          </div>
          <div className="input-group">
            <label>Update Password</label>
            <input type="password" placeholder="Enter new password" />
          </div>
          <button className="delete-account-btn">Delete Account</button>
        </section>

        {/* Profile Customization Section */}
        <section className="profile-customization">
          <h2 className="section-title">Profile Customization</h2>
          <button className="edit-profile-pic-btn">Edit Profile Pic</button>
          <div className="profile-pic-preview">
            <img
              src="/images/user-profile_5675125.png"
              alt="Profile Preview"
              className="profile-preview-image"
            />
          </div>
          <div className="input-group">
            <label>Update Username</label>
            <input type="text" placeholder="Enter new username" />
          </div>
          <div className="input-group">
            <label>Preferred Currency</label>
            <select>
              <option value="ksh">KSH</option>
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
            </select>
          </div>
        </section>

        {/* Theme Customization Section */}
        <section className="theme-customization">
          <h2 className="section-title">Theme Customization</h2>
          <div className="theme-options">
            <button
              className={`theme-button ${theme === "light" ? "active" : ""}`}
              onClick={() => handleThemeChange("light")}
            >
              Light Theme
            </button>
            <button
              className={`theme-button ${theme === "dark" ? "active" : ""}`}
              onClick={() => handleThemeChange("dark")}
            >
              Dark Theme
            </button>
          </div>
        </section>

        {/* Initial Currency Setup Section */}
        <section className="currency-setup">
          <h2 className="section-title">Initial Currency Setup</h2>
          <div className="input-group">
            <label>M-pesa</label>
            <input type="text" placeholder="Enter initial balance" />
          </div>
          <div className="input-group">
            <label>Family Bank</label>
            <input type="text" placeholder="Enter initial balance" />
          </div>
          <div className="input-group">
            <label>Equity Bank</label>
            <input type="text" placeholder="Enter initial balance" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
