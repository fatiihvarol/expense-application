import React, { useEffect, useState } from "react";
import { fetchExpensesByRole } from "../services/ExpenseFormService";
import { useNavigate } from "react-router-dom";
import "../styles/ExpenseList.css";
import Navbar from "./Navbar";
import { TOKENROLEPATH, USERROLE } from "../config/Constants";
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCurrency, setFilterCurrency] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const response = await fetchExpensesByRole();
        if (response.isSuccess) {
          setExpenses(response.result);
        } else {
          alert(response);
          navigate("/login");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getExpenses(); // Yalnızca bileşen ilk yüklendiğinde çağrılır
  }, []); // Boş bağımlılık dizisi

  const handleEdit = (id) => {
    navigate(`/edit-expense/${id}`);
  };

  if (loading) {
    return (
      <Box className="centered">
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <p className="error">{error}</p>;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesStatus =
      filterStatus === "All" || expense.expenseStatus === filterStatus;

    const matchesCurrency =
      filterCurrency === "All" || expense.currency === filterCurrency;

    return matchesStatus && matchesCurrency;
  });

  return (
    <div>
      <Navbar
        userRole={jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH]}
      />
      <div className="expense-list">
        <h2>Expense Forms List</h2>

        {(jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH] ===
          USERROLE[0] ||
          jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH] ===
            USERROLE[3]) && (
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Approved">Approved</option>
          </select>
        )}
        <div className="filter-section">
          <select
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
          >
            <option value="All">All Currencies</option>
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="USD">EUR</option>
            <option value="USD">PKR</option>
            <option value="USD">INR</option>
          </select>
        </div>

        {filteredExpenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <ul>
            {filteredExpenses.map((expense) => (
              <li
                key={expense.id}
                className={`expense-item ${expense.expenseStatus.toLowerCase()}`}
              >
                <p>
                  <strong>Employee No:</strong> {expense.employeeId}
                </p>
                <p
                  className={`expense-header`}
                  onClick={() => handleEdit(expense.id)}
                >
                  <strong>Total Amount:</strong> {expense.totalAmount}{" "}
                  {expense.currency}
                </p>
                <p>
                  <strong>Status:</strong> {expense.expenseStatus}
                </p>
                {expense.rejectionDescription && (
                  <p>
                    <strong>Rejection Description:</strong>{" "}
                    {expense.rejectionDescription}
                  </p>
                )}
                <p>
                  <strong>Total Expenses:</strong> {expense.expenses.length}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default () => (
  <ProtectedRoute
    allowedRoles={[USERROLE[0], USERROLE[1], USERROLE[2], USERROLE[3]]}
  >
    <ExpenseList />
  </ProtectedRoute>
);
