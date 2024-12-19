import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../styles/Login.css";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    validationSchema: Yup.object({
      usernameOrEmail: Yup.string().required("Username or Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form Data:", values); // Replace with actual login logic
      alert("Login Successful!");
    },
  });

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-heading">LOGIN</h1>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              className="login-input"
              value={formik.values.usernameOrEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.usernameOrEmail && formik.errors.usernameOrEmail && (
              <div className="error">{formik.errors.usernameOrEmail}</div>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login-input"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="login-text">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
