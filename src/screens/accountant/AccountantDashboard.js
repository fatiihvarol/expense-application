import React from 'react';
import Navbar from '../../components/Navbar';
import { TOKENROLEPATH } from '../../config/Constants';
import { jwtDecode } from 'jwt-decode';
const AccountantDashboard = () => {
    
    return (
        <div className="dashboard-container">
        <Navbar  userRole={jwtDecode(localStorage.getItem('token'))[TOKENROLEPATH]} />
        </div>
    );
};

export default AccountantDashboard;
