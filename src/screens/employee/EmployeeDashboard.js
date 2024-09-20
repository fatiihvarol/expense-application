import React from 'react';
import Navbar from '../../components/Navbar';
import { USERROLE } from '../../config/Constants';
import ProtectedRoute from '../../components/ProtectedRoute';
const EmployeeDashboard = () => {

    return (
        <div>
          <Navbar userRole = {USERROLE[0]}></Navbar>
        </div>
      );
};

export default () => (
  <ProtectedRoute allowedRoles={['Employee']}>
      <EmployeeDashboard />
  </ProtectedRoute>
);
