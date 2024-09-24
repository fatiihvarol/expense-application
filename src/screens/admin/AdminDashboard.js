import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { USERROLE } from '../../config/Constants';
import Navbar from '../../components/Navbar';
import ExpenseList from '../../components/ExpenseList';
const AdminDashboard = () => {
    
    return (
        <ExpenseList/> 
    );
};


export default () => (
    <ProtectedRoute allowedRoles={[USERROLE[3]]}>
        <AdminDashboard />
    </ProtectedRoute>
);