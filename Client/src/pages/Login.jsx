import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate(); 

  const [showPassword, setShowPassword] = useState(false); 
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("access_token", data.access_token); // Save the token
          localStorage.setItem("user_id", data.user_id); // Save the user ID
          navigate("/dashboard"); // Redirect to /dashboard
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-heading">LOGIN</h1>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="login-input"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password"
              className="login-input"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)} 
              className="password-toggle-icon-9"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} 
            </span>
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="login-text">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;