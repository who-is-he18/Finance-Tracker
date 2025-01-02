import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import axios from "axios"; // Import axios for API requests
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    username: "????",  // Add username state
    total_income: 0,
    total_expenses: 0,
    current_savings: 0,
    mpesa_balance: 0,
    family_bank_balance: 0,
    equity_bank_balance: 0,
  });

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: "ease-in-out", // Easing function
      once: true, // Whether animation should happen only once
    });

    // Fetch dashboard data for the user (Replace 1 with the actual user_id)
    const user_id = 9; // Change this to the actual user_id
    axios
      .get(`http://localhost:5000/api/dashboard/${user_id}`)
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the dashboard data:", error);
      });
  }, []);

  // Calculate the total income as the sum of the balances
  const totalIncome = dashboardData.mpesa_balance + dashboardData.family_bank_balance + dashboardData.equity_bank_balance;

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="dashboard-main">
        <section
          className="card income-card"
          data-aos="fade-up" // Animation for this section
        >
          <h3 className="card-title">TOTAL INCOME</h3>
          <ul className="card-details">
            <li>M-PESA: {dashboardData.mpesa_balance}</li>
            <li>Equity Bank: {dashboardData.equity_bank_balance}</li>
            <li>Family Bank: {dashboardData.family_bank_balance}</li>
            <li>TOTAL: {totalIncome}</li> {/* Display the total income */}
          </ul>
          <img
            src="/images/Revenue-rafiki.png"
            alt="Income"
            className="card-image"
          />
        </section>

        <section
          className="card expenses-card"
          data-aos="fade-right" // Animation for this section
        >
          <h3 className="card-title">TOTAL EXPENSES</h3>
          <ul className="card-details">
            <li>Housing: {dashboardData.total_expenses * 0.25}</li>
            <li>Food: {dashboardData.total_expenses * 0.25}</li>
            <li>Recreational: {dashboardData.total_expenses * 0.25}</li>
            <li>Clothing: {dashboardData.total_expenses * 0.25}</li>
          </ul>
          <img
            src="/images/Personal finance-bro.png"
            alt="Expenses"
            className="card-image"
          />
        </section>

        <section
          className="card savings-card"
          data-aos="fade-left" // Animation for this section
        >
          <h3 className="card-title">CURRENT SAVINGS</h3>
          <ul className="card-details">
            <li>M-Shwari: {dashboardData.current_savings}</li>
            <li>Equity Bank: {dashboardData.equity_bank_balance}</li>
            <li>Family Bank: {dashboardData.family_bank_balance}</li>
            <li>TOTAL: {dashboardData.total_income - dashboardData.total_expenses}</li>
          </ul>
          <img
            src="/images/Savings-pana.png"
            alt="Savings"
            className="card-image"
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
