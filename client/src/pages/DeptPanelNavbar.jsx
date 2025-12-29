import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const DeptPanelNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
   const handleLogout = () => {
    // ✅ session-based logout
    sessionStorage.clear();
    window.location.href = "/login";
  };
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/DeptDashboard" className="nav-logo">Coordinator Panel</Link>
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/deptadd-event">Add Event</Link>
          <Link to="/deptlist-event">List Events</Link>
          <Link to="/deptbook-venue">Book Venue</Link>
          <Link to="/deptdownloads">Downloads</Link>
          <Link to="/dept/participants/choose">View Participants</Link>
          <Link to="/dept/publish-results/choose">Publish Results</Link>
          <Link to="/dept/notifications">Notifications</Link>
          <Link to="/dept/profile">Profile</Link>
          <Link to="/dept/edit-event/choose">Edit Event</Link>

        <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>           
          
        </div>
      </div>
    </nav>
  );
};

export default DeptPanelNavbar;
