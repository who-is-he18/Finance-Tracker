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
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
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
    amount: "",
    description: "",
  });

  // Fetch transactions from the backend
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

  // Add new transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = 9;
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

            setIsAdding(false);
            resetForm();
            toast.success("Transaction added successfully!");
          })
          .catch((error) => {
            console.error("Error adding transaction:", error);
            toast.error("Failed to add transaction.");
          });
      }
    });
  };

  // Edit existing transaction
  const handleEditTransaction = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to edit this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, edit it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = 9;
        const originalTransaction = transactions.find(
          (transaction) => transaction.id === currentTransaction.id
        );

        if (!originalTransaction) return;

        const prevCategory = originalTransaction.category;
        const prevAmount = originalTransaction.amount;

        fetch(`http://localhost:5000/api/transactions/${userId}/${currentTransaction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentTransaction),
        })
          .then((response) => response.json())
          .then((data) => {
            setTransactions((prev) =>
              prev.map((transaction) =>
                transaction.id === data.id ? data : transaction
              )
            );

            const updatedExpenseData = { ...expenseData };
            if (prevCategory !== currentTransaction.category) {
              updatedExpenseData[prevCategory] -= prevAmount;
            }
            updatedExpenseData[currentTransaction.category] += currentTransaction.amount;

            setExpenseData(updatedExpenseData);
            setIsEditing(false);
            resetForm();
            toast.success("Transaction updated successfully!");
          })
          .catch((error) => {
            console.error("Error editing transaction:", error);
            toast.error("Failed to edit transaction.");
          });
      }
    });
  };

  // Delete transaction
  const deleteTransaction = (transactionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = 9;
        const transactionToDelete = transactions.find(
          (transaction) => transaction.id === transactionId
        );

        if (!transactionToDelete) return;

        fetch(`http://localhost:5000/api/transactions/${userId}/${transactionId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to delete transaction");
            }
            setTransactions((prev) =>
              prev.filter((transaction) => transaction.id !== transactionId)
            );

            const updatedExpenseData = { ...expenseData };
            updatedExpenseData[transactionToDelete.category] -= transactionToDelete.amount;
            setExpenseData(updatedExpenseData);

            toast.success("Transaction deleted successfully!");
          })
          .catch((error) => {
            console.error("Error deleting transaction:", error);
            toast.error("Failed to delete transaction.");
          });
      }
    });
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransaction({
      ...currentTransaction,
      [name]: name === "amount" ? value : value,
    });
  };

  // Reset form
  const resetForm = () => {
    setCurrentTransaction({
      category: "Food",
      source: "Family Bank",
      amount: "",
      description: "",
    });
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />
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
          <button
            className="add-transaction-button"
            onClick={() => setIsAdding(true)}
          >
            Add New Transaction <span className="plus-icon">+</span>
          </button>
        </section>
        {/* Form Modal */}
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
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={currentTransaction.description}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => (isAdding ? setIsAdding(false) : setIsEditing(false))}>
                Cancel
              </button>
            </form>
          </div>
        )}
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
