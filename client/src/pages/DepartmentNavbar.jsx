import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // you can replace with custom CSS if needed

const DepartmentNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

   const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const expiry = sessionStorage.getItem("sessionExpiry");

  // 🔐 if no valid session → redirect to login
  if (!user || !token || !expiry || Date.now() > Number(expiry)) {
    sessionStorage.clear();
    window.location.href = "/login";
  }

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        {/* LOGO / TITLE */}
        <Link to="/deptdashboard" className="nav-logo">
          <span>Department Panel</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/deptadd-event" className="nav-item">
            Add Event
          </Link>

          <Link to="/deptlist-event" className="nav-item">
            List Events
          </Link>

          <Link to="/deptbook-venue" className="nav-item">
            Book Venue
          </Link>

          <Link to="/deptdownloads" className="nav-item">
            Downloads
          </Link>

          {/* Logout */}
         <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DepartmentNavbar;
