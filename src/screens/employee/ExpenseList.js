import React, { useEffect, useState } from "react";
import { fetchMyExpenses } from "../../services/ExpenseFormService"; // Servis dosyasından fonksiyonu içe aktar
import { useNavigate } from "react-router-dom"; // React Router kullanımı için
import "../../styles/ExpenseList.css"; // CSS dosyasını içe aktar
import Navbar from "../../components/Navbar";
import { TOKENROLEPATH, USERROLE } from "../../config/Constants";
import ProtectedRoute from "../../components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

    getExpenses();
  }, []);

  // Harcamalar sadece "Pending" veya "Rejected" statüsünde ise düzenlenebilir
  const handleEdit = (id, expenseStatus) => {
    navigate(`/EditExpense/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <Navbar userRole={jwtDecode(localStorage.getItem('token'))[TOKENROLEPATH]} />
      <div className="expense-list">
        <h2>Expens Forms List</h2>
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
                  className={`expense-header `}
                  onClick={() => handleEdit(expense.id)}
                >
                  <strong>Total Amount:</strong> {expense.totalAmount}{" "}
                  {expense.currency}
                </p>
                <p>
                  <strong>Status:</strong> {expense.expenseStatus}
                </p>
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
  <ProtectedRoute allowedRoles={[USERROLE[0]]}>
    <ExpenseList />
  </ProtectedRoute>
);
