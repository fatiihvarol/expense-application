  import React, { useState } from "react";
  import "../../styles/ExpenseForm.css";
  import { CURRENCYOPTIONS, EXPENSECATEGORY, TOKENROLEPATH } from "../../config/Constants";
  import { submitExpenses } from "../../services/ExpenseFormService"; 
  import minusIcon from "../../assest/minus.png";
  import { useNavigate } from "react-router-dom"; 
  import { USERROLE } from "../../config/Constants";
  import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";


  const ExpenseForm = () => {
    const navigate = useNavigate();
    const [currency, setCurrency] = useState(CURRENCYOPTIONS[0]);
    const [expenses, setExpenses] = useState([
      {
        description: "",
        amount: 0,
        location: "",
        category: "",
        receiptNumber: "",
        error: "",
        isValid: true,
      },
    ]);
    const [total, setTotal] = useState(0);

    const handleExpenseChange = (index, field, value) => {
      const updatedExpenses = [...expenses];
      updatedExpenses[index][field] = value;
      updatedExpenses[index].isValid = true;
      setExpenses(updatedExpenses);
      setTotal(
        updatedExpenses.reduce(
          (sum, expense) => sum + parseFloat(expense.amount || 0),
          0
        )
      );
    };

    const handleAddExpense = () => {
      setExpenses([
        ...expenses,
        {
          description: "",
          amount: 0,
          location: "",
          category: "",
          receiptNumber: "",
          error: "",
          isValid: true,
        },
      ]);
    };

    const handleDeleteExpense = (index) => {
      const updatedExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(updatedExpenses);
      setTotal(
        updatedExpenses.reduce(
          (sum, expense) => sum + parseFloat(expense.amount || 0),
          0
        )
      );
    };

    const validateForm = () => {
      let isFormValid = true;
      const updatedExpenses = [...expenses];

      updatedExpenses.forEach((expense, index) => {
        if (
          !expense.description.trim() ||
          !expense.amount ||
          !expense.location.trim() ||
          !expense.category.trim() ||
          !expense.receiptNumber.trim() ||
          parseFloat(expense.amount) > 5000
        ) {
          updatedExpenses[index].isValid = false;
          isFormValid = false;
          if (parseFloat(expense.amount) > 5000) {
            alert(`Expense cannot exceed 5000 ${currency}.`);
          }
        } else {
          updatedExpenses[index].isValid = true;
        }
      });

      setExpenses(updatedExpenses);
      return isFormValid;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (validateForm()) {
        const payload = {
          totalAmount: total,
          currency: currency,
          expenses: expenses,
        };

        try {
          const response = await submitExpenses(payload);
          alert("Expenses submitted successfully:", response);
          navigate("/expenses");
        } catch (error) {
          alert("Error submitting expenses:", error.message);
        }
      } else {
        alert("There are empty fields or validation errors");
      }
    };

    return (
      <div>
        <Navbar  userRole={jwtDecode(localStorage.getItem('token'))[TOKENROLEPATH]} />

        <form onSubmit={handleSubmit}>
          <h2>Expense Form</h2>
          <label>Currency:</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCYOPTIONS.map((curr, index) => (
              <option key={index} value={curr}>
                {curr}
              </option>
            ))}
          </select>

          {expenses.map((expense, index) => (
            <div
              className={`expense-item ${!expense.isValid ? "error" : ""}`}
              key={index}
            >
              <input
                type="text"
                placeholder="Description"
                value={expense.description}
                onChange={(e) =>
                  handleExpenseChange(index, "description", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) =>
                  handleExpenseChange(index, "amount", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Location"
                value={expense.location}
                onChange={(e) =>
                  handleExpenseChange(index, "location", e.target.value)
                }
              />
              <select
                value={expense.category}
                onChange={(e) =>
                  handleExpenseChange(index, "category", e.target.value)
                }
              >
                <option value="">Select Category</option>
                {EXPENSECATEGORY.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Receipt Number"
                value={expense.receiptNumber}
                onChange={(e) =>
                  handleExpenseChange(index, "receiptNumber", e.target.value)
                }
              />
              <img
                src={minusIcon}
                alt="Delete Expense"
                className="delete-expense"
                onClick={() => handleDeleteExpense(index)}
              />
            </div>
          ))}

          <button type="button" onClick={handleAddExpense}>
            Add Another Expense
          </button>
          <p className="total-amount">Total: {total}</p>
          <button type="submit">Submit Form</button>
        </form>
      </div>
    );
  };

  export default () => (
    <ProtectedRoute allowedRoles={[USERROLE[0]]}>
        <ExpenseForm />
    </ProtectedRoute>
);
