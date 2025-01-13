import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [initialBalances, setInitialBalances] = useState({
    mpesa_balance: 0,
    family_bank_balance: 0,
    equity_bank_balance: 0,
  });

  const [incomeBySource, setIncomeBySource] = useState({
    mpesa_income: 0,
    family_bank_income: 0,
    equity_bank_income: 0,
  });

  const [expensesBySource, setExpensesBySource] = useState({
    mpesa_expenses: 0,
    family_bank_expenses: 0,
    equity_bank_expenses: 0,
  });

  useEffect(() => {
    const user_id = localStorage.getItem("user_id"); // Retrieve user ID from local storage

    if (!user_id) {
      toast.error("User ID not found.");
      return;
    }

    // Fetch initial balances (user setup)
    const fetchInitialBalances = async () => {
      try {
        const response = await axios.get(
          `https://finance-tracker-5.onrender.com/api/settings/initial-currencies/${user_id}`
        );
        setInitialBalances({
          mpesa_balance: response.data.mpesa_balance || 0,
          family_bank_balance: response.data.family_bank_balance || 0,
          equity_bank_balance: response.data.equity_bank_balance || 0,
        });
      } catch (error) {
        toast.error("Error fetching initial balances.");
      }
    };

    // Fetch income by source
    const fetchIncomeBySource = async () => {
      try {
        const response = await axios.get(
          `https://finance-tracker-5.onrender.com/api/transactions/income-by-source/${user_id}`
        );
        setIncomeBySource({
          mpesa_income: response.data.income_by_source["Mpesa"] || 0,
          family_bank_income: response.data.income_by_source["Family Bank"] || 0,
          equity_bank_income: response.data.income_by_source["Equity"] || 0,
        });
      } catch (error) {
        toast.error("Error fetching income by source.");
      }
    };

    // Fetch expenses by source
    const fetchExpensesBySource = async () => {
      try {
        const response = await axios.get(
          `https://finance-tracker-5.onrender.com/api/transactions/expenses-by-source/${user_id}`
        );
        setExpensesBySource({
          mpesa_expenses: response.data.expenses_by_source["Mpesa"] || 0,
          family_bank_expenses:
            response.data.expenses_by_source["Family Bank"] || 0,
          equity_bank_expenses: response.data.expenses_by_source["Equity"] || 0,
        });
      } catch (error) {
        toast.error("Error fetching expenses by source.");
      }
    };
    fetchInitialBalances();
    fetchIncomeBySource();
    fetchExpensesBySource();
  }, []);

  // Calculate the current savings by adding initial currency and income, then subtracting expenses
  const mpesaSavings = initialBalances.mpesa_balance + incomeBySource.mpesa_income - expensesBySource.mpesa_expenses;
  const familyBankSavings = initialBalances.family_bank_balance + incomeBySource.family_bank_income - expensesBySource.family_bank_expenses;
  const equityBankSavings = initialBalances.equity_bank_balance + incomeBySource.equity_bank_income - expensesBySource.equity_bank_expenses;

  // Calculate total savings
  const totalSavings = mpesaSavings + familyBankSavings + equityBankSavings;

  // Calculate total income
  const totalIncome = incomeBySource.mpesa_income + incomeBySource.family_bank_income + incomeBySource.equity_bank_income;

  // Calculate total expenses
  const totalExpenses = expensesBySource.mpesa_expenses + expensesBySource.family_bank_expenses + expensesBySource.equity_bank_expenses;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        {/* Income Section */}
        <section className="card income-card">
          <h3 className="card-title">TOTAL INCOME</h3>
          <ul className="card-details">
            <li>M-PESA: KES {incomeBySource.mpesa_income.toLocaleString()}</li>
            <li>Equity Bank: KES {incomeBySource.equity_bank_income.toLocaleString()}</li>
            <li>Family Bank: KES {incomeBySource.family_bank_income.toLocaleString()}</li>
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
        <section className="card expenses-card">
          <h3 className="card-title">TOTAL EXPENSES</h3>
          <ul className="card-details">
            <li>M-PESA: KES {expensesBySource.mpesa_expenses.toLocaleString()}</li>
            <li>Equity Bank: KES {expensesBySource.equity_bank_expenses.toLocaleString()}</li>
            <li>Family Bank: KES {expensesBySource.family_bank_expenses.toLocaleString()}</li>
            <li>
              <strong>TOTAL: KES {totalExpenses.toLocaleString()}</strong>
            </li>
          </ul>
          <img src="/images/Personal finance-bro.png"alt="Expenses"className="card-image"/>
        </section>

        {/* Savings Section */}
        <section className="card savings-card">
          <h3 className="card-title">CURRENT SAVINGS</h3>
          <ul className="card-details">
            <li>M-PESA Savings: KES {mpesaSavings.toLocaleString()}</li>
            <li>Equity Bank Savings: KES {equityBankSavings.toLocaleString()}</li>
            <li>Family Bank Savings: KES {familyBankSavings.toLocaleString()}</li>
            <li>
              <strong>TOTAL SAVINGS: KES {totalSavings.toLocaleString()}</strong>
            </li>
          </ul>
          <img src="/images/Savings-pana.png"alt="Savings"className="card-image"/>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;