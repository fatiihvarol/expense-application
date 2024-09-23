import React from 'react';
import Navbar from '../../components/Navbar';
import { TOKENROLEPATH } from '../../config/Constants';
import { jwtDecode } from 'jwt-decode';
import ExpenseList from '../../components/ExpenseList';
const AccountantDashboard = () => {
    
    return (
        <ExpenseList/>
    );
};

export default AccountantDashboard;
