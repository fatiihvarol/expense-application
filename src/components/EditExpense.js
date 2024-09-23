import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { USERROLE, CURRENCYOPTIONS, TOKENROLEPATH } from "../config/Constants"; 
import Navbar from "./Navbar";
import "../styles/EditExpense.css"; 
import { updateExpense, GetxpenseById, DeleteExpense, rejectExpense,approveExpense, payExpense } from "../services/ExpenseFormService";
import {jwtDecode} from "jwt-decode";

const EditExpense = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expenseData, setExpenseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("");
    const [rejectionDescription, setRejectionDescription] = useState("");
    const [showRejectionModal, setShowRejectionModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken[TOKENROLEPATH]); // Get user role from token
        }

        const fetchExpense = async () => {
            try {
                const response = await GetxpenseById(id);
                if (response.isSuccess) {
                    setExpenseData(response.result);
                } else if (response.errorMessage === "You don't have permission") {
                    navigate("/404"); // Redirect to your 404 component
                } else {
                    setError("Expense not found.");
                }
            } catch (err) {
                console.log(err)
                navigate("/404");
            } finally {
                setLoading(false);
            }
        };
    
        fetchExpense();
    }, [id, navigate]);

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

            await updateExpense(id, dataToUpdate);
            alert("Expense updated successfully!");
            navigate("/expenses");
        } catch (error) {
            alert("Error updating expense: " + (error.message || 'Unknown error'));
        }
    };

    const handleDelete = async () => {
        try {
            await DeleteExpense(id);
            alert("Expense Form Deleted Successfully");
            navigate("/expenses");
        } catch (error) {
            alert("Error deleting expense: " + (error.message || 'Unknown error'));
        }
    };

    const handleApprove = async () => {
        try {
            await approveExpense(id);
            alert("Expense Form Approved Successfully");
            navigate("/expenses");
        } catch (error) {
            alert("Error deleting expense: " + (error.message || 'Unknown error'));
        }
    };

    const handleReject = async () => {
        setShowRejectionModal(true); 
    };
    const handlePay = async () => {
        try {
           const response =await payExpense(id)
           if (response.isSuccess) {
            alert("Expense Form Paid")
            navigate('/expenses')
           }
        } catch (error) {
            alert(error.message)
        }
        payExpense(id)
    };

    const submitRejection = async () => {
        if (!rejectionDescription) {
            alert("Please provide a reason for rejection.");
            return;
        }

        try {
            await rejectExpense(id, rejectionDescription); // Call the rejection service
            alert("Expense rejected successfully.");
            navigate("/expenses");
        } catch (error) {
            alert("Error rejecting expense: " + (error.message || 'Unknown error'));
        } finally {
            setShowRejectionModal(false);  // Close the modal
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

    const isEditable = expenseData && (expenseData.expenseStatus === "Pending" || expenseData.expenseStatus === "Rejected") && userRole === USERROLE[0];

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
                            <label>Status:</label>
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
                                {isEditable && userRole === "Employee" && (
                                    <button onClick={() => removeExpense(index)}>Remove</button>
                                )}
                            </div>
                        ))}
                        {isEditable && userRole === "Employee" && (
                            <div>
                                <button onClick={addExpense}>Add Expense</button>
                                <button onClick={handleUpdate}>Update Expense Form</button>
                                <button onClick={handleDelete}>Delete Expense Form</button>
                            </div>
                        )}
                        {userRole === "Manager" && (
                            <div>
                                <button onClick={handleApprove}>Approve Expense Form</button>
                                <button onClick={handleReject}>Decline Expense Form</button>
                            </div>
                        )}
                        {userRole === "Accountant" && (
                            <div>
                                <button onClick={handlePay}>Pay Expense Form</button>
                               
                            </div>
                        )}
                        {userRole === "Admin" && (
                            <div>
                                {/* Admin-specific actions */}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Rejection Modal */}
            {showRejectionModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Reject Expense Form</h3>
                        <label>Reason for Rejection:</label>
                        <textarea
                            value={rejectionDescription}
                            onChange={(e) => setRejectionDescription(e.target.value)}
                            placeholder="Enter rejection reason"
                        />
                        <button onClick={submitRejection}>Submit</button>
                        <button onClick={() => setShowRejectionModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditExpense;
