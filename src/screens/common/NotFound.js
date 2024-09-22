import React from "react";
import { Link } from "react-router-dom";
import "../../styles/NotFound.css"; // CSS dosyası

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="home-link">
        Go back to Home
      </Link>
      <div className="not-found-animation"></div>
    </div>
  );
};

export default NotFound;
