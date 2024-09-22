import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { TOKENROLEPATH } from '../config/Constants';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    const userRole = decodedToken[TOKENROLEPATH];

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/404" replace />;
    }

    return children;
};

export default ProtectedRoute;
