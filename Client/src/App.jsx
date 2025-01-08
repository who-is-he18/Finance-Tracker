import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Layout from "./pages/Layout"; // Layout component

function App() {
  const [balances, setBalances] = useState({
    mpesa_balance: 0,
    family_bank_balance: 0,
    equity_bank_balance: 0,
  });

  // Fetch dashboard data (including expenses) and update the state
  const fetchDashboardData = async () => {
    const user_id = 9; // Replace with dynamic user ID if needed
    try {
      const [expensesRes, dashboardRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/expenses/${user_id}`),
        axios.get(`http://localhost:5000/api/dashboard/${user_id}`),
      ]);
      return {
        ...dashboardRes.data,
        total_expenses: expensesRes.data.aggregated_expenses,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return null;
    }
  };

  useEffect(() => {
    // Fetch the initial dashboard data when the component mounts
    fetchDashboardData();
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
          <Route
            path="dashboard"
            element={<Dashboard balances={balances} />}
          />
          <Route
            path="transactions"
            element={<Transactions />}
          />
          <Route
            path="settings"
            element={<Settings setBalances={setBalances} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
