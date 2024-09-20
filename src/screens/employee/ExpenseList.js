import React, { useEffect, useState } from 'react';
import { fetchMyExpenses } from '../../services/ExpenseFormService'; // Servis dosyasından fonksiyonu içe aktar
import { useNavigate } from 'react-router-dom'; // React Router kullanımı için
import '../../styles/ExpenseList.css'; // CSS dosyasını içe aktar
import Navbar from '../../components/Navbar';
import { USERROLE } from '../../config/Constants';
const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const getExpenses = async () => {
            try {
                const response = await fetchMyExpenses();
                if (response.isSuccess) {
                    setExpenses(response.result);
                } else {
                    alert(response  );
                    navigate('/login')
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getExpenses();
    }, []);

    const handleEdit = (id) => {
        navigate(`/EditExpense/${id}`); 
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <Navbar userRole={USERROLE[0]} />
        
        <div className="expense-list">
            <h2>My Expenses</h2>
            {expenses.length === 0 ? (
                <p>No expenses found.</p>
            ) : (
                <ul>
                    {expenses.map((expense) => (
                        <li key={expense.id} className={`expense-item ${expense.expenseStatus.toLowerCase()}`}>
                            <p className="expense-header" onClick={() => handleEdit(expense.id)}>
                                Total Amount: {expense.totalAmount} {expense.currency}
                            </p>
                            <p>Status: {expense.expenseStatus}</p>
                            <ul>
                                {expense.expenses.map((detail, index) => (
                                    <li key={index}>
                                        <p>Amount: {detail.amount}</p>
                                        <p>Description: {detail.description}</p>
                                        <p>Location: {detail.location}</p>
                                        <p>Category: {detail.category}</p>
                                        <p>Receipt Number: {detail.receiptNumber}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </div>
    );
};

export default ExpenseList;
