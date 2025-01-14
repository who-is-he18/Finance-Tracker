import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Settings.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";

const Settings = ({ setBalances }) => {
  const [theme, setTheme] = useState("light");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [initialBalances, setInitialBalances] = useState({
    mpesa_balance: 0,
    family_bank_balance: 0,
    equity_bank_balance: 0,
  });
  const userId = localStorage.getItem("user_id"); // Retrieve user ID from local storage

  useEffect(() => {
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }
    fetchSettings();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  }, [userId]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`https://pennywise-backend-gywb.onrender.com/api/settings/${userId}`);
      const data = await response.json();

      setInitialBalances({
        mpesa_balance: data.mpesa_balance || 0,
        family_bank_balance: data.family_bank_balance || 0,
        equity_bank_balance: data.equity_bank_balance || 0,
      });

      formik.setValues({
        ...formik.values,
        username: data.username || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Error fetching settings data.");
    }
  };

  const handleSaveBalances = async () => {
    try {
      const response = await fetch(`https://pennywise-backend-gywb.onrender.com/api/settings/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(initialBalances),
      });

      if (response.ok) {
        toast.success("Balances saved successfully!");
        fetchSettings();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving balances:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleBalanceChange = (e) => {
    const { name, value } = e.target;
    setInitialBalances((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const formik = useFormik({
    initialValues: {
      newEmail: "",
      newPassword: "",
      confirmPassword: "",
      username: "",
    },
    validationSchema: Yup.object({
      newEmail: Yup.string().email("Invalid email address"),
      newPassword: Yup.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
      username: Yup.string().required("Username is required"),
    }),
    onSubmit: async (values) => {
      const updatedSettings = {
        username: values.username,
      };

      try {
        const response = await fetch(`https://pennywise-backend-gywb.onrender.com/api/settings/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSettings),
        });

        if (response.ok) {
          toast.success("Settings updated successfully!");
          fetchSettings();
        } else {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          toast.error(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error updating settings:", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="settings-container">
      <main className="settings-main">
        <form onSubmit={formik.handleSubmit}>
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
                onClick={async () => {
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
                    console.log("Updating email with data:", updatedAccount);
                    const response = await fetch(`https://pennywise-backend-gywb.onrender.com/api/users/${userId}`, {
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
                      console.error("Error response:", errorData);
                      toast.error(`Error: ${errorData.message}`);
                    }
                  } catch (error) {
                    console.error("Error updating email:", error);
                    toast.error("An error occurred. Please try again.");
                  }
                }}
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
                  className="password-toggle-icon-8"
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
                  className="password-toggle-icon-7"
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
                onClick={async () => {
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
                    console.log("Updating password with data:", updatedAccount);
                    const response = await fetch(`https://pennywise-backend-gywb.onrender.com/api/users/${userId}`, {
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
                      console.error("Error response:", errorData);
                      toast.error(`Error: ${errorData.message}`);
                    }
                  } catch (error) {
                    console.error("Error updating password:", error);
                    toast.error("An error occurred. Please try again.");
                  }
                }}
              >
                Save Password
              </button>
            </div>
          </section>
  

          <section className="initial-currency-setup">
            <h2 className="section-title">Initial Currency Setup</h2>
            <div className="input-group">
              <label>M-Pesa Balance</label>
              <input
                type="number"
                name="mpesa_balance"
                value={initialBalances.mpesa_balance}
                onChange={handleBalanceChange}
                placeholder="Enter M-Pesa balance"
              />
            </div>
            <div className="input-group">
              <label>Family Bank Balance</label>
              <input
                type="number"
                name="family_bank_balance"
                value={initialBalances.family_bank_balance}
                onChange={handleBalanceChange}
                placeholder="Enter Family Bank balance"
              />
            </div>
            <div className="input-group">
              <label>Equity Bank Balance</label>
              <input
                type="number"
                name="equity_bank_balance"
                value={initialBalances.equity_bank_balance}
                onChange={handleBalanceChange}
                placeholder="Enter Equity Bank balance"
              />
            </div>
            <button
              type="button"
              className="save-button"
              onClick={handleSaveBalances}
            >
              Save Balances
            </button>
          </section>
        </form>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Settings;