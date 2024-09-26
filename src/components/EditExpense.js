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
import axios from "axios";
import minusIcon from "../assest/minus.png";
import { Box, CircularProgress } from "@mui/material";
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import Rejection from "./Rejection";

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
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken[TOKENROLEPATH]);
      }

      try {
        const expenseResponse = await GetxpenseById(id);
        if (!expenseResponse.isSuccess) {
          if (expenseResponse.errorMessage === "You don't have permission") {
            return navigate("/404");
          }
          setError("Expense not found.");
        } else {
          const updatedExpenses = expenseResponse.result.expenses.map(
            (expense) => ({
              ...expense,
              categoryId: expense.category.categoryId || "",
            })
          );
          setExpenseData({
            ...expenseResponse.result,
            expenses: updatedExpenses,
          });
        }
      } catch (error) {
        console.error("Error fetching expense:", error);
        navigate("/404");
      }

      try {
        const categoriesResponse = await axios.get(CATEGORYURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categoriesResponse.data.result);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const calculateTotalAmount = () => {
    return (
      expenseData?.expenses.reduce((sum, expense) => sum + expense.amount, 0) ||
      0
    );
  };

  const handleExpenseChange = (index, key, value) => {
    if (key === "remove") {
      if (expenseData.expenses.length === 1) {
        return alert("You must have at least one expense.");
      }
      const updatedExpenses = expenseData.expenses.filter((_, i) => i !== index);
      setExpenseData((prevData) => ({ ...prevData, expenses: updatedExpenses }));
      return;
    }
    if (key === "amount" && value > 5000) {
      return alert("Amount cannot exceed 5000 " + expenseData.currency );
    }

    const updatedExpenses = expenseData.expenses.map((exp, i) =>
      i === index ? { ...exp, [key]: value } : exp
    );
    setExpenseData((prevData) => ({ ...prevData, expenses: updatedExpenses }));
  };
  const handleRejection = async () => {
    if (!rejectionDescription.trim()) {
      return alert("Rejection reason cannot be empty.");
    }
  
    try {
      await rejectExpense(id, rejectionDescription);
      alert("Expense rejected successfully");
      navigate("/expenses");
    } catch (error) {
      alert(`Error rejecting expense: ${error.message || "Unknown error"}`);
    }
  };
  const handleAddExpense = () => {
    const newExpense = {
      amount: 0,
      description: "",
      location: "",
      categoryId: categories.length ? categories[0].categoryId : "",
      receiptNumber: "",
      date: new Date().toISOString().split("T")[0], // Set current date
    };
    setExpenseData((prevData) => ({
      ...prevData,
      expenses: [...prevData.expenses, newExpense],
    }));
  };

  const handleUpdate = async () => {
    for (let i = 0; i < expenseData.expenses.length; i++) {
      const exp = expenseData.expenses[i];
      if (!exp.description.trim()) {
        return alert(`Expense ${i + 1}: Description cannot be empty.`);
      }
      if (!exp.location.trim()) {
        return alert(`Expense ${i + 1}: Location cannot be empty.`);
      }
      if (!exp.categoryId) {
        return alert(`Expense ${i + 1}: Category must be selected.`);
      }
      if (!exp.receiptNumber.trim()) {
        return alert(`Expense ${i + 1}: Receipt number cannot be empty.`);
      }
      if (exp.amount <= 0) {
        return alert(`Expense ${i + 1}: Amount must be greater than 0.`);
      }
      if (!exp.date) {
        return alert(`Expense ${i + 1}: Date must be selected.`);
      }
    }
  
    // Update işlemi burada devam eder...
    try {
      const dataToUpdate = {
        totalAmount: calculateTotalAmount(),
        currency: expenseData.currency,
        expenses: expenseData.expenses.map(
          ({
            amount,
            description,
            location,
            categoryId,
            receiptNumber,
            date,
          }) => ({
            amount,
            description,
            location,
            categoryId,
            receiptNumber,
            date,
            expenseFormId: expenseData.id,
          })
        ),
      };
      await updateExpense(id, dataToUpdate);
      alert("Expense updated successfully!");
      navigate("/expenses");
    } catch (error) {
      alert(`Error updating expense: ${error.message || "Unknown error"}`);
    }
  };
  

  const handleAction = async (action, successMessage) => {
    try {
      await action(id);
      alert(successMessage);
      navigate("/expenses");
    } catch (error) {
      alert(`Error: ${error.message || "Unknown error"}`);
    }
  };

  if (loading)
    return (
      <Box className="centered">
        <CircularProgress />
      </Box>
    );
  if (error) return <div>{error}</div>;

  const isEditable =
    expenseData?.expenseStatus !== "Approved" && userRole === USERROLE[0];

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
                  onChange={(e) =>
                    handleExpenseChange(
                      index,
                      "amount",
                      parseFloat(e.target.value)
                    )
                  }
                  disabled={!isEditable}
                />
                <label>Description:</label>
                <input
                  type="text"
                  value={expense.description}
                  onChange={(e) =>
                    handleExpenseChange(index, "description", e.target.value)
                  }
                  disabled={!isEditable}
                />
                <label>Date:</label>
                <input
  type="date"
  value={
    expense.date
      ? new Date(new Date(expense.date).getTime() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : ""
  }
  onChange={(e) => handleExpenseChange(index, "date", e.target.value)}
  disabled={!isEditable}
/>

                <label>Location:</label>
                <input
                  type="text"
                  value={expense.location}
                  onChange={(e) =>
                    handleExpenseChange(index, "location", e.target.value)
                  }
                  disabled={!isEditable}
                />
                <label>Receipt Number:</label>
                <input
                  type="text"
                  value={expense.receiptNumber}
                  onChange={(e) =>
                    handleExpenseChange(index, "receiptNumber", e.target.value)
                  }
                  disabled={!isEditable}
                />
                <label>Category:</label>
                <select
                  value={expense.categoryId}
                  onChange={(e) =>
                    handleExpenseChange(index, "categoryId", e.target.value)
                  }
                  disabled={!isEditable}
                >
                  {categories.map(({ categoryId, categoryName }) => (
                    <option key={categoryId} value={categoryId}>
                      {categoryName}
                    </option>
                  ))}
                </select>
                {isEditable && (
                  <img
                    src={minusIcon}
                    alt="Delete Expense"
                    className="delete-expense"
                    onClick={() => handleExpenseChange(index, "remove", true)}
                  />
                )}
              </div>
            ))}
            {isEditable && (
              <div>
                <button onClick={handleAddExpense} className="save-button">
                  Add Expense
                </button>
                <button onClick={handleUpdate} className="update-button">
                  Update Expense
                </button>
                <button
                  onClick={() =>
                    handleAction(
                      DeleteExpense,
                      "Expense Form Deleted Successfully"
                    )
                  }
                  className="reject-button"
                >
                  Delete Expense
                </button>
              </div>
            )}
            {userRole === USERROLE[1] && (
              <div>
                <button
                  onClick={() =>
                    handleAction(
                      approveExpense,
                      "Expense Form Approved Successfully"
                    )
                  }
                  className="save-button"
                >
                  Approve Expense
                </button>
                <button
                  onClick={() => setShowRejectionModal(true)}
                  className="reject-button"
                >
                  Reject Expense
                </button>
              </div>
            )}
            {userRole === USERROLE[2] && (
              <div>
                <button
                  onClick={() =>
                    handleAction(
                      payExpense,
                      "Expense Form Paid Successfully"
                    )
                  }
                  className="save-button"
                >
                  Pay Expense
                </button>
              </div>
            )}
          </div>
        )}
      {/* Rejection Modal */}
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
          <button onClick={handleRejection} className="save-button">
            Submit Rejection
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
