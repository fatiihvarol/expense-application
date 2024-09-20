import React from 'react';
import Navbar from '../../components/Navbar';
import { USERROLE } from '../../config/Constants';
const EmployeeDashboard = () => {

    return (
        <div>
          <Navbar userRole = {USERROLE[0]}></Navbar>
        </div>
      );
};

export default EmployeeDashboard;
