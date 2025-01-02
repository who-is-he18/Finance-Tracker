import React, { useState, useEffect } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [mpesaBalance, setMpesaBalance] = useState("");
  const [familyBankBalance, setFamilyBankBalance] = useState("");
  const [equityBankBalance, setEquityBankBalance] = useState("");
  const userId = 9; // Replace with actual logged-in user ID

  useEffect(() => {
    // Fetch the settings (initial balances) when the component loads
    fetch(`http://localhost:5000/api/settings/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.mpesa_balance) setMpesaBalance(data.mpesa_balance);
        if (data.family_bank_balance) setFamilyBankBalance(data.family_bank_balance);
        if (data.equity_bank_balance) setEquityBankBalance(data.equity_bank_balance);
      })
      .catch((error) => console.error("Error fetching settings:", error));
  }, [userId]);

  useEffect(() => {
    document.body.className = theme; // Apply theme class to body
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme preference
  };

  const handleSaveBalances = () => {
    const updatedSettings = {
      mpesa_balance: parseFloat(mpesaBalance),
      family_bank_balance: parseFloat(familyBankBalance),
      equity_bank_balance: parseFloat(equityBankBalance),
    };

    fetch(`http://localhost:5000/api/settings/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSettings),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Settings updated successfully:", data);
        // Optionally notify the user with a success message
      })
      .catch((error) => console.error("Error updating settings:", error));
  };

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
            <input
              type="number"
              value={mpesaBalance}
              onChange={(e) => setMpesaBalance(e.target.value)}
              placeholder="Enter initial balance"
            />
          </div>
          <div className="input-group">
            <label>Family Bank</label>
            <input
              type="number"
              value={familyBankBalance}
              onChange={(e) => setFamilyBankBalance(e.target.value)}
              placeholder="Enter initial balance"
            />
          </div>
          <div className="input-group">
            <label>Equity Bank</label>
            <input
              type="number"
              value={equityBankBalance}
              onChange={(e) => setEquityBankBalance(e.target.value)}
              placeholder="Enter initial balance"
            />
          </div>
          <button className="save-button" onClick={handleSaveBalances}>
            Save Balances
          </button>
        </section>
      </main>
    </div>
  );
};

export default Settings;
