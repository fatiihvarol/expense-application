import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { USERROLE } from '../../config/Constants';
const AdminDashboard = () => {
    
    return (
        <div className="dashboard-container">
            <h1>Welcome to the ADMİN Dashboard</h1>
            <p>This is the main page after login.</p>
            <button>click</button>
        </div>
    );
};


export default () => (
    <ProtectedRoute allowedRoles={[USERROLE[3]]}>
        <AdminDashboard />
    </ProtectedRoute>
);