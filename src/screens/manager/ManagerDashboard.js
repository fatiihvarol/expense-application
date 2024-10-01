import React from 'react';
import { USERROLE } from '../../config/Constants';
import ProtectedRoute from '../../components/ProtectedRoute'
import ExpenseList from '../../components/ExpenseList';
const ManagerDashboard = () => {
    
    return (
        <ExpenseList/>      
    );
};

export default () => (
    <ProtectedRoute allowedRoles={[USERROLE[1]]}>
        <ManagerDashboard />
    </ProtectedRoute>
);
