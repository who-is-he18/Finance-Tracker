import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Transactions.css";

const Transactions = () => {
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
              {/* Example empty rows */}
              <tr>
                <td>---</td>
                <td>---</td>
                <td>---</td>
                <td>---</td>
                <td>---</td>
              </tr>
              {/* Add dynamic rows here */}
            </tbody>
          </table>
          <button className="add-transaction-button">
            Add New Transaction <span className="plus-icon">+</span>
          </button>
        </section>

        <section className="transactions-chart">
          <h3>Expenses by Category</h3>
          <div className="chart">
             <div className="bar" style={{ height: "50%" }} data-label="Food"></div>
             <div className="bar" style={{ height: "70%" }} data-label="Clothing"></div>
             <div className="bar" style={{ height: "90%" }} data-label="Housing"></div>
             <div className="bar" style={{ height: "80%" }} data-label="Recreational"></div>
          </div>

        </section>
      </main>
    </div>
  );
};

export default Transactions;
