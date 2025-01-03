import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "../styles/Transactions.css";
import "font-awesome/css/font-awesome.min.css";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [expenseData, setExpenseData] = useState({
    Housing: 0,
    Food: 0,
    Recreational: 0,
    Clothing: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({
    category: "Food",
    source: "Family Bank",
    amount: "", // Changed to an empty string
    description: "",
  });

  // Fetch transactions on component mount
  useEffect(() => {
    const userId = 9;
    fetch(`http://localhost:5000/api/transactions/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions);

        const aggregatedExpenses = {
          Housing: 0,
          Food: 0,
          Recreational: 0,
          Clothing: 0,
        };

        data.transactions.forEach((transaction) => {
          if (transaction.category in aggregatedExpenses) {
            aggregatedExpenses[transaction.category] += transaction.amount;
          }
        });

        setExpenseData(aggregatedExpenses);
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  // Handle adding a new transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    const userId = 9;

    // Convert amount to a number before sending to the backend
    const transactionToAdd = {
      ...currentTransaction,
      amount: parseFloat(currentTransaction.amount || 0),
    };

    fetch(`http://localhost:5000/api/transactions/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionToAdd),
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions([...transactions, data]);

        const updatedExpenseData = { ...expenseData };
        if (data.category in updatedExpenseData) {
          updatedExpenseData[data.category] += data.amount;
        }
        setExpenseData(updatedExpenseData);

        // Reset state
        setIsAdding(false);
        resetForm();
      })
      .catch((error) => console.error("Error adding transaction:", error));
  };

  // Handle editing a transaction
  const handleEditTransaction = (e) => {
    e.preventDefault();
    const userId = 9;

    // Calculate the previous amount from the current transaction
    const prevAmount = transactions.find((transaction) => transaction.id === currentTransaction.id)?.amount || 0;

    // Make the PUT request to update the transaction
    fetch(`http://localhost:5000/api/transactions/${userId}/${currentTransaction.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentTransaction),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the transaction in the state
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === data.id ? data : transaction
          )
        );

        // Update the expense data by subtracting the old amount and adding the new one
        const updatedExpenseData = { ...expenseData };
        updatedExpenseData[prevAmount ? currentTransaction.category : data.category] -= prevAmount; // Remove previous value
        updatedExpenseData[data.category] += data.amount; // Add new value

        // Update the expense data state
        setExpenseData(updatedExpenseData);

        // Reset state
        setIsEditing(false);
        resetForm();
      })
      .catch((error) => console.error("Error editing transaction:", error));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow empty value for amount, otherwise update normally
    setCurrentTransaction({
      ...currentTransaction,
      [name]: name === "amount" ? value : value,
    });
  };

  // Reset the transaction form
  const resetForm = () => {
    setCurrentTransaction({
      category: "Food",
      source: "Family Bank",
      amount: "", // Keep amount as an empty string
      description: "",
    });
  };

  // Handle deleting a transaction
  const deleteTransaction = (transactionId) => {
    const userId = 9;
    const transactionToDelete = transactions.find((transaction) => transaction.id === transactionId);
    
    if (!transactionToDelete) return;

    fetch(`http://localhost:5000/api/transactions/${userId}/${transactionId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete transaction");
        }
        // Remove the deleted transaction from the state
        setTransactions((prev) =>
          prev.filter((transaction) => transaction.id !== transactionId)
        );

        // Update expense data by subtracting the deleted transaction's amount from the category
        const updatedExpenseData = { ...expenseData };
        updatedExpenseData[transactionToDelete.category] -= transactionToDelete.amount;

        setExpenseData(updatedExpenseData);
      })
      .catch((error) => console.error("Error deleting transaction:", error));
  };

  return (
    <div className="dashboard-container">
      <main className="transactions-main">
        {/* Transactions Table */}
        <section className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6">No transactions found</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.source}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.description}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => {
                          setIsEditing(true);
                          setCurrentTransaction(transaction);
                        }}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button className="add-transaction-button" onClick={() => setIsAdding(true)}>
            Add New Transaction <span className="plus-icon">+</span>
          </button>
        </section>

        {/* Add/Edit Form */}
        {(isAdding || isEditing) && (
          <div className="modal">
            <form onSubmit={isAdding ? handleAddTransaction : handleEditTransaction}>
              <h2>{isAdding ? "Add New Transaction" : "Edit Transaction"}</h2>
              <label>
                Category:
                <select
                  name="category"
                  value={currentTransaction.category}
                  onChange={handleInputChange}
                >
                  <option value="Housing">Housing</option>
                  <option value="Food">Food</option>
                  <option value="Recreational">Recreational</option>
                  <option value="Clothing">Clothing</option>
                </select>
              </label>
              <label>
                Source:
                <select
                  name="source"
                  value={currentTransaction.source}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Family Bank">Family Bank</option>
                  <option value="Equity">Equity</option>
                  <option value="Mpesa">Mpesa</option>
                </select>
              </label>
              <label>
                Amount:
                <input
                  type="number"
                  name="amount"
                  value={currentTransaction.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={currentTransaction.description}
                  onChange={handleInputChange}
                ></textarea>
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => (isAdding ? setIsAdding(false) : setIsEditing(false))}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Bar Chart */}
        <section className="transactions-graph">
          <Bar
            data={{
              labels: Object.keys(expenseData),
              datasets: [
                {
                  label: "Expenses",
                  data: Object.values(expenseData),
                  backgroundColor: "#4CAF50",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Expense Categories",
                },
              },
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default Transactions;
