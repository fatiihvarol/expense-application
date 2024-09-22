import React, { useEffect, useState } from "react";
import { fetchExpensesByRole } from "../services/ExpenseFormService";
import { useNavigate } from "react-router-dom";
import "../styles/ExpenseList.css";
import Navbar from "./Navbar";
import { TOKENROLEPATH, USERROLE } from "../config/Constants";
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <Navbar
        userRole={jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH]}
      />
      <div className="expense-list">
        <h2>Expense Forms List</h2>
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <ul>
            {expenses.map((expense) => (
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
                {expense.rejectionDescription != null &&
                  <p>
                  <strong>Rejection Description:</strong> {expense.rejectionDescription}
                </p>
                }
                <p>
                  <strong>Number of Expenses:</strong> {expense.expenses.length}
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
  <ProtectedRoute allowedRoles={[USERROLE[0],USERROLE[1],USERROLE[2],USERROLE[3]]}>
    <ExpenseList />
  </ProtectedRoute>
);
