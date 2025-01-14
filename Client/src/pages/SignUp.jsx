import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons
import "../styles/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("https://pennywise-backend-gywb.onrender.com/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        });

        if (response.ok) {
          navigate("/login"); // Navigate to login page after successful signup
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("An error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h1 className="form-heading">WELCOME!</h1>
        <form onSubmit={formik.handleSubmit} className="form-body">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-input"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="form-error">{formik.errors.username}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-input"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="form-error">{formik.errors.email}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              name="password"
              placeholder="Password"
              className="form-input"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)} 
              className="password-toggle-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon */}
            </span>
            {formik.touched.password && formik.errors.password && (
              <div className="form-error">{formik.errors.password}</div>
            )}
          </div>
          <div className="form-group">
            <input
              type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
              name="confirmPassword"
              placeholder="Confirm Password"
              className="form-input"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="password-toggle-icon"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon */}
            </span>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="form-error">{formik.errors.confirmPassword}</div>
            )}
          </div>
          <button type="submit" className="form-button">
            Sign Up
          </button>
        </form>
        <p className="form-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
