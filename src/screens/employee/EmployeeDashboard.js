import React from 'react';
import Navbar from '../../components/Navbar';
import { JWTROLE, USERROLE } from '../../config/Constants';
import ProtectedRoute from '../../components/ProtectedRoute';
const EmployeeDashboard = () => {

    return (
        <div>
          <Navbar userRole = {USERROLE[0]}></Navbar>
        </div>
      );
};

export default () => (
  <ProtectedRoute allowedRoles={[USERROLE[0]]}>
      <EmployeeDashboard />
  </ProtectedRoute>
);
