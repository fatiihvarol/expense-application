import React from 'react';
import ExpenseForm from './ExpenseForm';
import Navbar from '../../components/Navbar';
const EmployeeDashboard = () => {

    return (
        <div>
          <Navbar userRole = "Employee"></Navbar>
          <ExpenseForm />
        </div>
      );
};

export default EmployeeDashboard;
