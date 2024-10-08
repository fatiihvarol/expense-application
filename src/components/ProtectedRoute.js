import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { TOKENROLEPATH } from "../config/Constants";

const ProtectedRoute = ({ allowedRoles, children }) => {
  try {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);

    const userRole = decodedToken[TOKENROLEPATH];

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/404" replace />;
  }
};

export default ProtectedRoute;
