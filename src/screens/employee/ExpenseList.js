import React, { useEffect, useReducer, useState } from "react";
import { fetchMyExpenses, DeleteExpense } from "../../services/ExpenseFormService";
import { useNavigate } from "react-router-dom";
import "../../styles/ExpenseList.css";
import Navbar from "../../components/Navbar";
import { TOKENROLEPATH, USERROLE } from "../../config/Constants";
import ProtectedRoute from "../../components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [reducerValue,forceUpdate] = useReducer(x=> x+1,0)

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const response = await fetchMyExpenses();
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
  }, [reducerValue]); // Boş bağımlılık dizisi

  const handleEdit = (id) => {
    navigate(`/EditExpense/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await DeleteExpense(id);
      forceUpdate() 
      console.log("burda")
        alert('Expense Form Deleted Successfully');  
          
      
    } catch (error) {
      alert(error.message);
    }
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
                  <strong>Employee ID :</strong> {expense.employeeId}
                </p>
                <p
                  className={`expense-header`}
                  onClick={() => handleEdit(expense.id)}
                >
                  <strong>Total Amount:</strong> {expense.totalAmount} {expense.currency}
                </p>
                <p>
                  <strong>Status:</strong> {expense.expenseStatus}
                </p>
                <p>
                  <strong>Number of Expenses:</strong> {expense.expenses.length}
                </p>
                {(expense.expenseStatus === "Pending" || expense.expenseStatus === "Rejected") && (
                  <button onClick={() => handleDelete(expense.id)} className="delete-button">Delete</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default () => (
  <ProtectedRoute allowedRoles={[USERROLE[0]]}>
    <ExpenseList />
  </ProtectedRoute>
);
