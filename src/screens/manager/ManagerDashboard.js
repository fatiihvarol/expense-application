import React from 'react';
import { USERROLE } from '../../config/Constants';
import ProtectedRoute from '../../components/ProtectedRoute'
import Navbar from '../../components/Navbar';
const ManagerDashboard = () => {
    
    return (
        <div className="dashboard-container">
         <Navbar userRole = {USERROLE[1]}></Navbar>

      
        </div>
    );
};

export default () => (
    <ProtectedRoute allowedRoles={[USERROLE[1]]}>
        <ManagerDashboard />
    </ProtectedRoute>
);
