import React from 'react';
import '../styles/Navbar.css'; // CSS dosyanızı buraya ekleyin
import logoutIcon from '../assest/logout.png'; // Logout ikonu
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const renderLinks = () => {
    switch (userRole) {
      case 'Employee':
        return (
          <>
          <li><a href="/Employee">Home</a></li>
            <li><a href="/expenses">My Expenses</a></li>
            <li><a href="/AddExpense">Add Expense</a></li>
          </>
        );
      case 'Manager':
        return (
          <>
            <li><a href="/expenses">Pending Approvals</a></li>
          </>
        );
      case 'Accountant':
        return (
          <>
            <li><a href="/expenses">Pending Payments</a></li>
          </>
        );
      case 'Admin':
        return (
          <>
            <li><a href="/user-management">User Management</a></li>
            <li><a href="/site-settings">Site Settings</a></li>
          </>
        );
      default:
        return <li><a href="/login">Login</a></li>;
    }
  };

  const handleLogout = () => {
    navigate('/login');
    localStorage.clear();
  };

  return (
    <nav className="navbar">
      <ul>
        {renderLinks()}
      </ul>
      <img 
        src={logoutIcon} 
        alt="Logout" 
        className="logout-icon" 
        onClick={handleLogout} 
      />
    </nav>
  );
};

export default Navbar;
