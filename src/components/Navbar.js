import React, { useState } from 'react';
import '../styles/Navbar.css'; // CSS dosyanızı buraya ekleyin
import logoutIcon from '../assest/logout.png'; // Logout ikonu
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

  const renderLinks = () => {
    switch (userRole) {
      case 'Employee':
        return (
          <>
            <li><a href="/employee">Home</a></li>
            <li><a href="/expenses">My Expenses</a></li>
            <li><a href="/add-expense">Add Expense</a></li>
          </>
        );
      case 'Manager':
        return (
          <>
            <li><a href="/manager">Pending Approvals</a></li>
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
                      <li><a href="/expenses">Home</a></li>

            <li 
              className="dropdown" 
              onMouseEnter={() => setIsDropdownOpen(true)} 
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <a href="#">Reports</a>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><a href="/pie-chart">Pie Chart</a></li>
                  <li><a href="/bar-chart">Bar Chart</a></li>
                  <li><a href="/bar-chart-status">Status Bar Chart</a></li>
                </ul>
              )}
            </li>
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
