// DepartmentNavbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const DepartmentNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dept/dashboard" className="nav-logo">
          <span>Department Panel</span>
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/dept/add-event" className="nav-item">Add Event</Link>
          <Link to="/dept/list-event" className="nav-item">List Events</Link>
          <Link to="/dept/book-venue" className="nav-item">Book Venue</Link>
          <Link to="/dept/downloads" className="nav-item">Downloads</Link>
        </div>
      </div>
    </nav>
  );
};

export default DepartmentNavbar;
