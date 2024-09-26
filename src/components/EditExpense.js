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
    if (key === "amount" && value > 5000) {
      alert("Allowed Expense Limit is 5000 "+expenseData.currency);
      return;
    }
    const updatedExpenses = expenseData.expenses.map((exp, i) =>
      i === index ? { ...exp, [key]: value } : exp
    );
    setExpenseData((prevData) => ({ ...prevData, expenses: updatedExpenses }));
  };

  const handleUpdate = async () => {
    if (
      !expenseData.expenses.every(
        (exp) =>
          exp.description.trim() &&
          exp.location.trim() &&
          exp.categoryId &&
          exp.receiptNumber.trim() &&
          exp.amount > 0&&
          exp.date
      )
    ) {
      return alert("All fields must be filled in for each expense.");
    }

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
                      ? new Date(expense.date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleExpenseChange(index, "date", e.target.value)
                  }
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
                <button
                  onClick={() =>
                    handleExpenseChange(expenseData.expenses.length, "add", {})
                  }
                  className="save-button"
                >
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
            {userRole === "Accountant" && (
              <button
                onClick={() => handleAction(payExpense, "Expense Form Paid")}
                className="save-button"
              >
                Pay Expense Form
              </button>
            )}
            {userRole === "Admin" && (
              <button onClick={() => navigate(`/history/${id}`)}>
                See History
              </button>
            )}
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
              <button
                onClick={() =>
                  handleAction(
                    () => rejectExpense(id, rejectionDescription),
                    "Expense rejected successfully"
                  )
                }
                className="save-button"
              >
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
