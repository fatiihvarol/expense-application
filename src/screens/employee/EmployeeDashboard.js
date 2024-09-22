import React from 'react';
import Navbar from '../../components/Navbar';
import { TOKENROLEPATH, USERROLE } from '../../config/Constants';
import ProtectedRoute from '../../components/ProtectedRoute';
import '../../styles/EmployeeDashboard.css'; // CSS dosyası
import { jwtDecode } from 'jwt-decode';

const EmployeeDashboard = () => {
    return (
        <div className="dashboard-container">
            <Navbar  userRole={jwtDecode(localStorage.getItem('token'))[TOKENROLEPATH]} />
            <div className="dashboard-content">
                <div className="dashboard-cards">
                    <div className="card">
                        <h3>Total Expenses</h3>
                        <p>$12,345</p>
                    </div>
                    <div className="card">
                        <h3>Pending Approvals</h3>
                        <p>5</p>
                    </div>
                    <div className="card">
                        <h3>Approved Expenses</h3>
                        <p>$9,876</p>
                    </div>
                </div>

                <div className="dashboard-table">
                    <h3>Recent Activities</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Expense Type</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>22/09/2024</td>
                                <td>Travel</td>
                                <td>Approved</td>
                                <td>$500</td>
                            </tr>
                            <tr>
                                <td>20/09/2024</td>
                                <td>Accommodation</td>
                                <td>Pending</td>
                                <td>$1,200</td>
                            </tr>
                            <tr>
                                <td>18/09/2024</td>
                                <td>Meals</td>
                                <td>Approved</td>
                                <td>$80</td>
                            </tr>
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
