import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Layout from "./pages/Layout";

function App() {
  const [balances, setBalances] = useState({
    mpesa_balance: 0,
    family_bank_balance: 0,
    equity_bank_balance: 0,
  });

  useEffect(() => {
    // Optionally fetch the initial data when the app loads (e.g., balances, user data)
    axios.get("https://pennywise-backend-gywb.onrender.com/api/dashboard/1")
      .then(response => {
        setBalances(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard balances={balances} />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings setBalances={setBalances} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
