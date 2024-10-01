import React from "react";
import { USERROLE } from "../../config/Constants";
import ExpenseList from "../../components/ExpenseList";
import ProtectedRoute from "../../components/ProtectedRoute";
const AccountantDashboard = () => {
  return <ExpenseList />;
};

export default () => (
    <ProtectedRoute allowedRoles={[USERROLE[2]]}>
      <AccountantDashboard />
    </ProtectedRoute>
  );
