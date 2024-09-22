import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASEURL, USERROLE, CURRENCYOPTIONS } from "../../config/Constants"; 
import Navbar from "../../components/Navbar";
import "../../styles/EditExpense.css"; 
import { updateExpense , GetxpenseById } from "../../services/ExpenseFormService";
import ProtectedRoute from "../../components/ProtectedRoute";

const EditExpense = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expenseData, setExpenseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await GetxpenseById(id)
                if (response.isSuccess) {
                    setExpenseData(response.result);
                } else {
                    setError("Expense not found.");
                }
            } catch (err) {
                setError("Error fetching expense data.");
            } finally {
                setLoading(false);
            }
        };

        fetchExpense();
    }, [id]);

    const calculateTotalAmount = () => {
        if (expenseData && expenseData.expenses) {
            return expenseData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        }
        return 0;
    };

    const handleUpdate = async () => {
        for (const expense of expenseData.expenses) {
            if (!expense.description || !expense.location || !expense.category || !expense.receiptNumber) {
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
                expenses: expenseData.expenses.map(exp => ({
                    amount: exp.amount,
                    description: exp.description,
                    location: exp.location,
                    category: exp.category,
                    receiptNumber: exp.receiptNumber,
                    expenseFormId: expenseData.id 
                }))
            };

            const response = await updateExpense(id, dataToUpdate);
            alert("Expense updated successfully!");
            navigate("/MyExpenses");
        } catch (error) {
            alert("Error updating expense: " + (error.message || 'Unknown error'));
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

    const addExpense = () => {
        const newExpense = { amount: 0, description: "", location: "", category: "", receiptNumber: "" };
        setExpenseData({ ...expenseData, expenses: [...expenseData.expenses, newExpense] });
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const isEditable = expenseData.expenseStatus === "Pending" || expenseData.expenseStatus === "Rejected";

    return (
        <div className="edit-expense-container">
            <Navbar userRole={USERROLE[0]} />
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
                            onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
                            disabled={!isEditable}
                        >
                            {CURRENCYOPTIONS.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Status :</label>
                        <input
                         value={expenseData.expenseStatus}
                            type="text"
                            readOnly 
                        />
                    </div>
                    <h4>Expenses</h4>
                    {expenseData.expenses.map((expense, index) => (
                        <div key={index} className="expense-item">
                            <label>Description:</label>
                            <input
                                type="text"
                                value={expense.description}
                                onChange={(e) => {
                                    const updatedExpenses = [...expenseData.expenses];
                                    updatedExpenses[index].description = e.target.value;
                                    setExpenseData({ ...expenseData, expenses: updatedExpenses });
                                }}
                                placeholder="Description"
                                disabled={!isEditable}
                            />
                            <label>Amount:</label>
                            <input
                                type="number"
                                value={expense.amount}
                                onChange={(e) => handleAmountChange(index, e.target.value)} 
                                placeholder="Amount"
                                disabled={!isEditable}
                            />
                            <label>Location:</label>
                            <input
                                type="text"
                                value={expense.location}
                                onChange={(e) => {
                                    const updatedExpenses = [...expenseData.expenses];
                                    updatedExpenses[index].location = e.target.value;
                                    setExpenseData({ ...expenseData, expenses: updatedExpenses });
                                }}
                                placeholder="Location"
                                disabled={!isEditable}
                            />
                            <label>Category:</label>
                            <input
                                type="text"
                                value={expense.category}
                                onChange={(e) => {
                                    const updatedExpenses = [...expenseData.expenses];
                                    updatedExpenses[index].category = e.target.value;
                                    setExpenseData({ ...expenseData, expenses: updatedExpenses });
                                }}
                                placeholder="Category"
                                disabled={!isEditable}
                            />
                            <label>Receipt Number:</label>
                            <input
                                type="text"
                                value={expense.receiptNumber}
                                onChange={(e) => {
                                    const updatedExpenses = [...expenseData.expenses];
                                    updatedExpenses[index].receiptNumber = e.target.value;
                                    setExpenseData({ ...expenseData, expenses: updatedExpenses });
                                }}
                                placeholder="Receipt Number"
                                disabled={!isEditable}
                            />
                            {isEditable &&<button onClick={() => removeExpense(index)} disabled={!isEditable}>Remove</button>}
                        </div>
                    ))}
                  {isEditable && (
                        <div>
                            <button onClick={addExpense}>Add Expense</button>
                            <button onClick={handleUpdate}>Update Expense</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default () => (
    <ProtectedRoute allowedRoles={[USERROLE[0]]}>
        <EditExpense />
    </ProtectedRoute>
);
