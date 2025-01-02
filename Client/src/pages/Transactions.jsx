import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [expenseData, setExpenseData] = useState({
    Housing: 0,
    Food: 0,
    Recreational: 0,
    Clothing: 0
  });

  useEffect(() => {
    // Fetch the transactions from the API
    const userId = 9; // Replace with the actual logged-in user ID
    fetch(`http://localhost:5000/api/transactions/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions);

        // Calculate expenses by category
        const expenses = {
          Housing: 0,
          Food: 0,
          Recreational: 0,
          Clothing: 0
        };

        data.transactions.forEach((transaction) => {
          if (transaction.category === "expense") {
            expenses[transaction.source] += transaction.amount;
          }
        });

        setExpenseData(expenses);
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="transactions-main">
        <section className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5">No transactions found</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.source}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button className="add-transaction-button">
            Add New Transaction <span className="plus-icon">+</span>
          </button>
        </section>

        <section className="transactions-chart">
          <h3>Expenses by Category</h3>
          <div className="chart">
            {Object.entries(expenseData).map(([category, amount]) => (
              <div
                key={category}
                className="bar"
                style={{ height: `${(amount / 1000) * 100}%` }} // Adjust max value based on the data range
                data-label={category}
              >
                <span className="category-label">{category}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Transactions;
