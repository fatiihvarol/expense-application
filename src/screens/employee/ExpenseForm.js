import React, { useState, useEffect } from "react";
import "../../styles/ExpenseForm.css";
import {
  CURRENCYOPTIONS,
  TOKENROLEPATH,
  USERROLE,
} from "../../config/Constants";
import { submitExpenses } from "../../services/ExpenseFormService";
import minusIcon from "../../assest/minus.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const CATEGORYURL = "https://localhost:7295/api/ExpenseCategories";

const ExpenseForm = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState(CURRENCYOPTIONS[0]);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(CATEGORYURL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const categoriesData = response.data.result; // Kategorileri al

        setCategories(categoriesData); // Kategorileri duruma ayarla

        // Eğer kategoriler mevcutsa, ilk kategorinin categoryId'si ile harcama öğelerini ayarla
        if (categoriesData.length > 0) {
          setExpenses([
            {
              description: "",
              amount: 0,
              location: "",
              categoryId: categoriesData[0].categoryId, // İlk kategoriyi ayarla
              receiptNumber: "",
              error: "",
              isValid: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  const handleCategoryChange = (index, categoryId) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index].categoryId = categoryId;
    setExpenses(updatedExpenses);
  };

  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      {
        description: "",
        amount: 0,
        location: "",
        categoryId: categories[0].categoryId,
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
        expenses: expenses.map((expense) => ({
          description: expense.description,
          amount: expense.amount,
          location: expense.location,
          categoryId: expense.categoryId, // Submit the categoryId
          receiptNumber: expense.receiptNumber,
        })),
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
      <Navbar
        userRole={jwtDecode(localStorage.getItem("token"))[TOKENROLEPATH]}
      />

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

            <input
              type="text"
              placeholder="Receipt Number"
              value={expense.receiptNumber}
              onChange={(e) =>
                handleExpenseChange(index, "receiptNumber", e.target.value)
              }
            />
            <select
              defaultValue={expense.categoryId}
              onChange={(e) => handleCategoryChange(index, e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
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
