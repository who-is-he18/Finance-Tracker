import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [balances, setBalances] = useState({
    mpesa_balance: 0,
    family_bank_balance: 0,
    equity_bank_balance: 0,
  });

  const [dashboardData, setDashboardData] = useState({
    total_expenses: {
      Housing: 0,
      Food: 0,
      Recreational: 0,
      Clothing: 0,
    },
  });

  useEffect(() => {
    AOS.init();

    const user_id = 9; // Replace with dynamic user ID if needed

    const fetchBalances = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/settings/${user_id}`);
        const data = await response.json();
        setBalances({
          mpesa_balance: data.mpesa_balance || 0,
          family_bank_balance: data.family_bank_balance || 0,
          equity_bank_balance: data.equity_bank_balance || 0,
        });
      } catch (error) {
        console.error("Error fetching balances:", error);
        toast.error("Error fetching balances.");
      }
    };

    const fetchData = async () => {
      try {
        const [expensesRes, dashboardRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/expenses/${user_id}`),
          axios.get(`http://localhost:5000/api/dashboard/${user_id}`),
        ]);

        setDashboardData({
          ...dashboardRes.data,
          total_expenses: expensesRes.data.aggregated_expenses,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Error fetching dashboard data.");
      }
    };

    fetchBalances();
    fetchData();
  }, []);

  // Calculating total income and savings
  const totalIncome =
    balances.mpesa_balance +
    balances.family_bank_balance +
    balances.equity_bank_balance;

  const totalSavings =
    totalIncome -
    Object.values(dashboardData.total_expenses).reduce((a, b) => a + b, 0);

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        {/* Income Section */}
        <section className="card income-card" data-aos="fade-up">
          <h3 className="card-title">TOTAL INCOME</h3>
          <ul className="card-details">
            <li>M-PESA: KES {balances.mpesa_balance.toLocaleString()}</li>
            <li>Equity Bank: KES {balances.equity_bank_balance.toLocaleString()}</li>
            <li>Family Bank: KES {balances.family_bank_balance.toLocaleString()}</li>
            <li>
              <strong>TOTAL: KES {totalIncome.toLocaleString()}</strong>
            </li>
          </ul>
          <img
            src="/images/Revenue-rafiki.png"
            alt="Income"
            className="card-image"
          />
        </section>

        {/* Expenses Section */}
        <section className="card expenses-card" data-aos="fade-up">
          <h3 className="card-title">TOTAL EXPENSES</h3>
          <ul className="card-details">
            {Object.entries(dashboardData.total_expenses).map(
              ([category, amount]) => (
                <li key={category}>
                  {category}: KES {amount.toLocaleString()}
                </li>
              )
            )}
          </ul>
          <img
            src="/images/Personal finance-bro.png"
            alt="Expenses"
            className="card-image"
          />
        </section>

        {/* Savings Section */}
        <section className="card savings-card" data-aos="fade-up">
          <h3 className="card-title">CURRENT SAVINGS</h3>
          <ul className="card-details">
            <li>M-PESA: KES {balances.mpesa_balance.toLocaleString()}</li>
            <li>Equity Bank: KES {balances.equity_bank_balance.toLocaleString()}</li>
            <li>Family Bank: KES {balances.family_bank_balance.toLocaleString()}</li>
            <li>
              <strong>TOTAL: KES {totalSavings.toLocaleString()}</strong>
            </li>
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
