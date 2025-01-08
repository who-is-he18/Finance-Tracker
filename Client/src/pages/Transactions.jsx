import React, { useEffect, useState } from "react";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from "chart.js";
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
  const [transactionData, setTransactionData] = useState({
    Income: { Salary: 0, Investments: 0, Businesses: 0, Other: 0 },
    Expenses: { Housing: 0, Food: 0, Recreational: 0, Clothing: 0 },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState({
    type: "Income",
    category: "Salary",
    source: "Family Bank",
    amount: "",
    description: "",
  });

  const userId = 9; // Replace with dynamic user ID

  // Fetch transactions from the backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/transactions/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions);

        const incomeData = { Salary: 0, Investments: 0, Businesses: 0, Other: 0 };
        const expenseData = { Housing: 0, Food: 0, Recreational: 0, Clothing: 0 };

        data.transactions.forEach((transaction) => {
          if (transaction.type_of === "Income") {
            incomeData[transaction.category] += transaction.amount;
          } else {
            expenseData[transaction.category] += transaction.amount;
          }
        });

        setTransactionData({ Income: incomeData, Expenses: expenseData });
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
        const transactionToAdd = {
          ...currentTransaction,
          type_of: currentTransaction.type, // Change 'type' to 'type_of'
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

            const updatedTransactionData = { ...transactionData };
            updatedTransactionData[data.type_of][data.category] += data.amount;
            setTransactionData(updatedTransactionData);

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

  // Edit a transaction
  const handleEditTransaction = (e) => {
    e.preventDefault();
  
    console.log("Current transaction before update:", currentTransaction);
  
    const updatedTransaction = {
      ...currentTransaction,
      type_of: currentTransaction.type_of, // Use 'type_of' directly
      amount: parseFloat(currentTransaction.amount || 0),
    };
  
    console.log("Updated transaction payload:", updatedTransaction);
  
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/api/transactions/${userId}/${currentTransaction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTransaction),
        })
          .then((response) => {
            console.log("Response status:", response.status);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Response data:", data);
  
            // Update transactions state
            const updatedTransactions = transactions.map((transaction) =>
              transaction.id === data.id ? data : transaction
            );
            setTransactions(updatedTransactions);
  
            // Update transactionData state
            const updatedTransactionData = { ...transactionData };
            if (data.type_of && data.category) {
              // Subtract the old amount and add the new amount
              const oldTransaction = transactions.find((transaction) => transaction.id === data.id);
              if (oldTransaction) {
                updatedTransactionData[oldTransaction.type_of][oldTransaction.category] -= oldTransaction.amount;
              }
              updatedTransactionData[data.type_of][data.category] += data.amount;
            }
            setTransactionData(updatedTransactionData);
  
            setIsEditing(false);
            resetForm();
            toast.success("Transaction updated successfully!");
          })
          .catch((error) => {
            console.error("Error updating transaction:", error);
            toast.error("Failed to update transaction.");
          });
      }
    });
  };

  // Delete a transaction
  const handleDeleteTransaction = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This transaction will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/api/transactions/${userId}/${id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then(() => {
            setTransactions(transactions.filter((transaction) => transaction.id !== id));

            const deletedTransaction = transactions.find((t) => t.id === id);
            const updatedTransactionData = { ...transactionData };
            updatedTransactionData[deletedTransaction.type_of][deletedTransaction.category] -= deletedTransaction.amount;

            setTransactionData(updatedTransactionData);
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
      [name]: value,
    });
  };

  // Reset form
  const resetForm = () => {
    setCurrentTransaction({
      type: "Income",
      category: "Salary",
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
                <th>Type</th>
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
                  <td colSpan="7">No transactions found</td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.type_of}</td>
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
                        onClick={() => handleDeleteTransaction(transaction.id)}
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
            <form onSubmit={isEditing ? handleEditTransaction : handleAddTransaction}>
              <h2>{isAdding ? "Add New Transaction" : "Edit Transaction"}</h2>
              <label>
                Type:
                <select
                  name="type"
                  value={currentTransaction.type}
                  onChange={handleInputChange}
                >
                  <option value="Income">Income</option>
                  <option value="Expenses">Expenses</option>
                </select>
              </label>
              <label>
                Category:
                <select
                  name="category"
                  value={currentTransaction.category}
                  onChange={handleInputChange}
                >
                  {currentTransaction.type === "Income" ? (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Investments">Investments</option>
                      <option value="Businesses">Businesses</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Housing">Housing</option>
                      <option value="Food">Food</option>
                      <option value="Recreational">Recreational</option>
                      <option value="Clothing">Clothing</option>
                    </>
                  )}
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
              <button type="button" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Transaction Graph */}
        <section className="transactions-graph">
          <Bar
            data={{
              labels: Object.keys(transactionData.Expenses),
              datasets: [
                {
                  label: "Expenses",
                  data: Object.values(transactionData.Expenses),
                  backgroundColor: "#FF6384",
                },
                {
                  label: "Income",
                  data: Object.values(transactionData.Income),
                  backgroundColor: "#36A2EB",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: "Transaction Categories",
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
