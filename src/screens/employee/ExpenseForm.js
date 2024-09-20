import React, { useState } from 'react';
import { CURRENCYOPTIONS } from '../../config/Constants';
import "../../styles/ExpenseForm.css"
const ExpenseForm = () => {
  // Form genelindeki veriler
  const [currency, setCurrency] = useState(CURRENCYOPTIONS[0]);
  
  // Her bir harcama için detaylar
  const [expenses, setExpenses] = useState([{ description: '', amount: 0, location: '', category: '', receiptNumber: '' }]);
  const [total, setTotal] = useState(0);

  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][field] = value;
    setExpenses(updatedExpenses);
    setTotal(updatedExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0));
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { description: '', amount: 0, location: '', category: '', receiptNumber: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      totalAmount: total,
      currencyEnum: currency,
      expenses: expenses.map(expense => ({
        description: expense.description,
        amount: parseFloat(expense.amount),
        location: expense.location,
        category: expense.category,
        receiptNumber: expense.receiptNumber
      }))
    };

    console.log('Form Data:', formData);
    // Burada backend'e formData'yı post edebilirsin.
    // Örn: axios.post('/api/expense-form', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
  <h2>Expense Form</h2>

  {/* Tek seferlik seçilecek veriler */}
  <label>Currency:</label>
  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
    {CURRENCYOPTIONS.map((curr, index) => (
      <option key={index} value={curr}>{curr}</option>
    ))}
  </select>



  {/* Her harcama için girilecek alanlar */}
  {expenses.map((expense, index) => (
    <div className="expense-item" key={index}>
      <input
        type="text"
        placeholder="Description"
        value={expense.description}
        onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={expense.amount}
        onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        value={expense.location}
        onChange={(e) => handleExpenseChange(index, 'location', e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={expense.category}
        onChange={(e) => handleExpenseChange(index, 'category', e.target.value)}
      />
      <input
        type="text"
        placeholder="Receipt Number"
        value={expense.receiptNumber}
        onChange={(e) => handleExpenseChange(index, 'receiptNumber', e.target.value)}
      />
    </div>
  ))}

  <button type="button" onClick={handleAddExpense}>Add Another Expense</button>
  <p className="total-amount">Total: {total}</p>
  <button type="submit">Submit Form</button>
</form>

  );
};

export default ExpenseForm;
