import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { TOKENROLEPATH, USERROLE } from '../../config/Constants';
import ProtectedRoute from '../../components/ProtectedRoute';
import '../../styles/EmployeeDashboard.css';
import { employeeInfo } from '../../services/ExpenseFormService'; // import your service
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EmployeeDashboard = () => {
    const [expenseData, setExpenseData] = useState(null);  // State to hold API data
    const [error, setError] = useState(null);  // State to handle error
    const navigate = useNavigate(); // Get navigate function

    useEffect(() => {
        // Fetch data from backend when component mounts
        const fetchData = async () => {
            try {
                const response = await employeeInfo();
                if (response.isSuccess) {
                    setExpenseData(response.result);
                } else {
                    setError(response.errorMessage);
                }
            } catch (err) {
                setError('Failed to load data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!expenseData) {
        return <div>Loading...</div>;  // Show loading indicator while fetching data
    }

    const handleOnClick = (formId) => {
        navigate(`/edit-expense/${formId}`); // Navigate to the expense details page with the form ID
    };

    return (
        <div >
            <Navbar userRole={jwtDecode(localStorage.getItem('token'))[TOKENROLEPATH]} />
            <div className="dashboard-content">
                <div className="dashboard-cards">
                    <div className="card">
                        <h3>Total Expenses</h3>
                        <p>{expenseData.totalExpenseCount}</p>
                    </div>
                    <div className="card">
                        <h3>Pending Approvals</h3>
                        <p>{expenseData.pendingApprovalCount}</p>
                    </div>
                    <div className="card">
                        <h3>Approved Expenses</h3>
                        <p>{expenseData.approvedCount}</p>
                    </div>
                    <div className="card">
                        <h3>Amount</h3>
                        <ul>
                            {Object.entries(expenseData.totalExpenseAmount).map(([currency, amount]) => (
                                <li key={currency}>
                                    {currency}: {amount}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="dashboard-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Form ID</th>
                                <th>Total Amount</th>
                                <th>Currency</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseData.lastExpenseForms.map((form) => (
                                <tr key={form.id} onClick={() => handleOnClick(form.id)}> {/* Pass the form ID */}
                                    <td>{form.id}</td>
                                    <td>{form.totalAmount}</td>
                                    <td>{form.currency}</td>
                                    <td>{form.expenseStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default () => (
  <ProtectedRoute allowedRoles={[USERROLE[0]]}>
      <EmployeeDashboard />
  </ProtectedRoute>
);
