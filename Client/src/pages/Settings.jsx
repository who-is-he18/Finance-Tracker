import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Settings.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useProfile } from "./ProfileContext";

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const { profilePic, setProfilePic } = useProfile();
  const [profilePicPreview, setProfilePicPreview] = useState(profilePic);
  const userId = 9; // Replace with actual logged-in user ID

  useEffect(() => {
    fetch(`http://localhost:5000/api/settings/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.mpesa_balance) formik.setFieldValue("mpesaBalance", data.mpesa_balance);
        if (data.family_bank_balance) formik.setFieldValue("familyBankBalance", data.family_bank_balance);
        if (data.equity_bank_balance) formik.setFieldValue("equityBankBalance", data.equity_bank_balance);
      })
      .catch((error) => console.error("Error fetching settings:", error));
  }, [userId]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("username", formik.values.username);
    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfilePic(data.profile_pic);
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const formik = useFormik({
    initialValues: {
      mpesaBalance: "",
      familyBankBalance: "",
      equityBankBalance: "",
      newEmail: "",
      newPassword: "",
      confirmPassword: "",
      username: "",
    },
    validationSchema: Yup.object({
      mpesaBalance: Yup.number().required("M-pesa balance is required"),
      familyBankBalance: Yup.number().required("Family Bank balance is required"),
      equityBankBalance: Yup.number().required("Equity Bank balance is required"),
      newEmail: Yup.string().email("Invalid email address"),
      newPassword: Yup.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
      username: Yup.string().required("Username is required"),
    }),
    onSubmit: async (values) => {
      try {
        const updatedSettings = {
          mpesa_balance: parseFloat(values.mpesaBalance),
          family_bank_balance: parseFloat(values.familyBankBalance),
          equity_bank_balance: parseFloat(values.equityBankBalance),
        };

        const response = await fetch(`http://localhost:5000/api/settings/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSettings),
        });

        if (response.ok) {
          toast.success("Balances updated successfully!");
        } else {
          const errorData = await response.json();
          toast.error(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error updating settings:", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  const handleUpdateEmail = async () => {
    const currentPassword = prompt("Please enter your current password to confirm:");
    if (!currentPassword) {
      toast.error("Current password is required to update email.");
      return;
    }

    const updatedAccount = {
      email: formik.values.newEmail,
      current_password: currentPassword,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAccount),
      });

      if (response.ok) {
        toast.success("Email updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleUpdatePassword = async () => {
    const currentPassword = prompt("Please enter your current password to confirm:");
    if (!currentPassword) {
      toast.error("Current password is required to update password.");
      return;
    }

    const updatedAccount = {
      password: formik.values.newPassword,
      current_password: currentPassword,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAccount),
      });

      if (response.ok) {
        toast.success("Password updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="settings-container">
      {/* Main Content */}
      <main className="settings-main">
        <form onSubmit={formik.handleSubmit}>
          {/* Account Settings Section */}
          <section className="account-settings">
            <h2 className="section-title">Account Settings</h2>
            <div className="input-group">
              <label>Update Email</label>
              <input
                type="email"
                name="newEmail"
                value={formik.values.newEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter new email"
              />
              {formik.touched.newEmail && formik.errors.newEmail && (
                <div className="form-error">{formik.errors.newEmail}</div>
              )}
              <button
                type="button"
                className="save-button"
                onClick={handleUpdateEmail}
              >
                Save Email
              </button>
            </div>
            <div className="input-group">
              <label>Update Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter new password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="form-error">{formik.errors.newPassword}</div>
              )}
            </div>
            <div className="input-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Confirm new password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="form-error">{formik.errors.confirmPassword}</div>
              )}
              <button
                type="button"
                className="save-button"
                onClick={handleUpdatePassword}
              >
                Save Password
              </button>
            </div>
          </section>

          {/* Profile Customization Section */}
          <section className="profile-customization">
            <h2 className="section-title">Profile Customization</h2>
            <div className="input-group">
              <label>Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleProfilePicChange} />
              <div className="profile-pic-preview">
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="profile-preview-image"
                />
              </div>
            </div>
            <div className="input-group">
              <label>Update Username</label>
              <input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter new username"
              />
              {formik.touched.username && formik.errors.username && (
                <div className="form-error">{formik.errors.username}</div>
              )}
            </div>
            <button
              type="button"
              className="save-button"
              onClick={handleProfileUpdate}
            >
              Save Profile
            </button>
          </section>

          {/* Theme Customization Section */}
          <section className="theme-customization">
            <h2 className="section-title">Theme Customization</h2>
            <div className="theme-options">
              <button
                type="button"
                className={`theme-button ${theme === "light" ? "active" : ""}`}
                onClick={() => handleThemeChange("light")}
              >
                Light Theme
              </button>
              <button
                type="button"
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
                name="mpesaBalance"
                value={formik.values.mpesaBalance}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter initial balance"
              />
              {formik.touched.mpesaBalance && formik.errors.mpesaBalance && (
                <div className="form-error">{formik.errors.mpesaBalance}</div>
              )}
            </div>
            <div className="input-group">
              <label>Family Bank</label>
              <input
                type="number"
                name="familyBankBalance"
                value={formik.values.familyBankBalance}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter initial balance"
              />
              {formik.touched.familyBankBalance && formik.errors.familyBankBalance && (
                <div className="form-error">{formik.errors.familyBankBalance}</div>
              )}
            </div>
            <div className="input-group">
              <label>Equity Bank</label>
              <input
                type="number"
                name="equityBankBalance"
                value={formik.values.equityBankBalance}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter initial balance"
              />
              {formik.touched.equityBankBalance && formik.errors.equityBankBalance && (
                <div className="form-error">{formik.errors.equityBankBalance}</div>
              )}
            </div>
            <button type="submit" className="save-button">
              Save Balances
            </button>
          </section>
        </form>
      </main>

      {/* ToastContainer to show notifications */}
      <ToastContainer />
    </div>
  );
};

export default Settings;