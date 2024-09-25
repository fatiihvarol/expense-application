import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { USERROLE, CURRENCYOPTIONS, TOKENROLEPATH } from "../config/Constants";
import Navbar from "./Navbar";
import "../styles/EditExpense.css";
import {
  updateExpense,
  GetxpenseById,
  DeleteExpense,
  rejectExpense,
  approveExpense,
  payExpense,
} from "../services/ExpenseFormService";
import { fetchExpenseFormHistory } from "../services/ExpenseFormHistoryService";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import minusIcon from "../assest/minus.png";
import ProtectedRoute from "./ProtectedRoute";
import { Box, CircularProgress } from "@mui/material";
const CATEGORYURL = "https://localhost:7295/api/ExpenseCategories";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [rejectionDescription, setRejectionDescription] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken[TOKENROLEPATH]); // Get user role from token
    }

    const fetchExpense = async () => {
      try {
        const response = await GetxpenseById(id);
        if (response.isSuccess) {
          const updatedExpenses = response.result.expenses.map((expense) => ({
            ...expense,
            categoryId: expense.category.categoryId || "",
          }));
          setExpenseData({ ...response.result, expenses: updatedExpenses });
        } else if (response.errorMessage === "You don't have permission") {
          navigate("/404"); // Redirect to 404
        } else {
          setError("Expense not found.");
        }
      } catch (err) {
        console.log(err);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(CATEGORYURL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setCategories(response.data.result); // Set fetched categories
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchExpense();
    fetchCategories(); // Fetch categories when component mounts
  }, [id, navigate]);

  const calculateTotalAmount = () => {
    if (expenseData && expenseData.expenses) {
      return expenseData.expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
    }
    return 0;
  };

  const handleUpdate = async () => {
    for (const expense of expenseData.expenses) {
      console.log(expense);
      // Check only for mandatory fields
      if (
        !expense.description.trim() ||
        !expense.location.trim() ||
        !expense.categoryId ||
        !expense.receiptNumber.trim()
      ) {
        alert("All fields must be filled in for each expense.");
        return;
      }
      if (expense.amount <= 0) {
        alert("Amount must be greater than 0.");
        return;
      }
    }
   

    try {
      const dataToUpdate = {
        totalAmount: calculateTotalAmount(),
        currency: expenseData.currency,
        expenses: expenseData.expenses.map((exp) => ({
          amount: exp.amount,
          description: exp.description.trim(),
          location: exp.location.trim(),
          categoryId: exp.categoryId,
          receiptNumber: exp.receiptNumber.trim(),
          expenseFormId: expenseData.id,
        })),
      };

      // Call the service with updated data
      await updateExpense(id, dataToUpdate);
      alert("Expense updated successfully!");
      navigate("/expenses");
    } catch (error) {
      alert("Error updating expense: " + (error.message || "Unknown error"));
    }
  };
  const handleHistory = async (id) =>
    {
        navigate(`/history/${id}`);
    }
  const handleDelete = async () => {
    try {
      await DeleteExpense(id);
      alert("Expense Form Deleted Successfully");
      navigate("/expenses");
    } catch (error) {
      alert("Error deleting expense: " + (error.message || "Unknown error"));
    }
  };

  const handleApprove = async () => {
    try {
      await approveExpense(id);
      alert("Expense Form Approved Successfully");
      navigate("/expenses");
    } catch (error) {
      alert("Error approving expense: " + (error.message || "Unknown error"));
    }
  };

  const handleReject = () => {
    setShowRejectionModal(true);
  };

  const handlePay = async () => {
    try {
      const response = await payExpense(id);
      if (response.isSuccess) {
        alert("Expense Form Paid");
        navigate("/expenses");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const submitRejection = async () => {
    if (!rejectionDescription) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      await rejectExpense(id, rejectionDescription);
      alert("Expense rejected successfully.");
      navigate("/expenses");
    } catch (error) {
      alert("Error rejecting expense: " + (error.message || "Unknown error"));
    } finally {
      setShowRejectionModal(false);
    }
  };

  const handleAmountChange = (index, value) => {
    if (value > 5000) {
      alert("Each expense amount cannot exceed 5000.");
      return;
    }

    const updatedExpenses = [...expenseData.expenses];
    updatedExpenses[index].amount = parseFloat(value);
    setExpenseData({ ...expenseData, expenses: updatedExpenses });
  };

  const handleCategoryChange = (index, categoryId) => {
    const updatedExpenses = [...expenseData.expenses];
    updatedExpenses[index].categoryId = categoryId;
    setExpenseData({ ...expenseData, expenses: updatedExpenses });
  };

  const addExpense = () => {
    const newExpense = {
      amount: 0,
      description: "",
      location: "",
      categoryId: categories[0].categoryId,
      receiptNumber: "",
    };
    setExpenseData({
      ...expenseData,
      expenses: [...expenseData.expenses, newExpense],
    });
  };

  const removeExpense = (index) => {
    if (expenseData.expenses.length <= 1) {
      alert("At least one expense must remain.");
      return;
    }

    const updatedExpenses = expenseData.expenses.filter((_, i) => i !== index);
    setExpenseData({ ...expenseData, expenses: updatedExpenses });
  };

  if (loading) {
    return (
      <Box className="centered">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const isEditable =
    expenseData &&
    (expenseData.expenseStatus === "Pending" ||
      expenseData.expenseStatus === "Rejected") &&
    userRole === USERROLE[0];

  return (
    <div>
      <Navbar userRole={userRole} />
      <div className="edit-expense-container">
        <h2>Edit Expense</h2>
        {expenseData && (
          <div>
            <div>
              <label>Total Amount:</label>
              <input
                type="number"
                value={calculateTotalAmount()}
                readOnly
                disabled={!isEditable}
              />
            </div>
            <div>
              <label>Currency:</label>
              <select
                value={expenseData.currency}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, currency: e.target.value })
                }
                disabled={!isEditable}
              >
                {CURRENCYOPTIONS.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            {expenseData.expenses.map((expense, index) => (
              <div key={index} className="expense-item">
                <label>Amount:</label>
                <input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  disabled={!isEditable}
                />
                <label>Description:</label>
                <input
                  type="text"
                  value={expense.description}
                  onChange={(e) => {
                    const updatedExpenses = [...expenseData.expenses];
                    updatedExpenses[index].description = e.target.value;
                    setExpenseData({
                      ...expenseData,
                      expenses: updatedExpenses,
                    });
                  }}
                  placeholder="Description"
                  disabled={!isEditable}
                />
                <label>Location:</label>
                <input
                  type="text"
                  value={expense.location}
                  onChange={(e) => {
                    const updatedExpenses = [...expenseData.expenses];
                    updatedExpenses[index].location = e.target.value;
                    setExpenseData({
                      ...expenseData,
                      expenses: updatedExpenses,
                    });
                  }}
                  placeholder="Location"
                  disabled={!isEditable}
                />
                <label>Receipt Number:</label>
                <input
                  type="text"
                  value={expense.receiptNumber}
                  onChange={(e) => {
                    const updatedExpenses = [...expenseData.expenses];
                    updatedExpenses[index].receiptNumber = e.target.value;
                    setExpenseData({
                      ...expenseData,
                      expenses: updatedExpenses,
                    });
                  }}
                  placeholder="Receipt Number"
                  disabled={!isEditable}
                />
                <label>Category:</label>
                <select
                  defaultValue={expense.categoryId}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  disabled={!isEditable}
                >
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {isEditable && (
                  <img
                    src={minusIcon}
                    alt="Delete Expense"
                    className="delete-expense"
                    onClick={() => removeExpense(index)}
                  />
                )}
              </div>
            ))}
            {isEditable && (
              <div>
                <button onClick={addExpense} className="save-button">
                  Add Expense
                </button>
                <button onClick={handleUpdate} className="update-button">
                  Update Expense
                </button>
                <button onClick={handleDelete} className="reject-button">
                  Delete Expense
                </button>
              </div>
            )}
            {userRole === USERROLE[1] && (
              <div>
                <button onClick={handleApprove} className="save-button">
                  Approve Expense
                </button>
                <button onClick={handleReject} className="reject-button">
                  Reject Expense
                </button>
              </div>
            )}
            {userRole === "Accountant" && (
              <div>
                <button className="save-button" onClick={handlePay}>Pay Expense Form</button>
              </div>
            )}
            {userRole === "Admin" && <div>{/* Admin-specific actions */}
            <button  onClick={() => handleHistory(id)} >See History</button>

                </div>}
          </div>
        )}
        {showRejectionModal && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="modal-close-button"
                onClick={() => setShowRejectionModal(false)}
              >
                &times;
              </button>
              <h3>Reject Expense</h3>
              <textarea
                value={rejectionDescription}
                onChange={(e) => setRejectionDescription(e.target.value)}
                placeholder="Reason for rejection"
              />
              <button onClick={submitRejection} className="save-button">
                Submit Rejection
              </button>
              <button
                onClick={() => setShowRejectionModal(false)}
                className="reject-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default () => (
  <ProtectedRoute
    allowedRoles={[USERROLE[0], USERROLE[1], USERROLE[2], USERROLE[3]]}
  >
    <EditExpense />
  </ProtectedRoute>
);
