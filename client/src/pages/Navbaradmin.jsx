import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
//import "./more.css"; // Or create a separate Navbar.css if you want
import logo from "../assets/image.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
      <Link to="/dashboard" className="nav-logo">
  <img
    src={logo}
    alt="Logo"
    style={{
      width: "25px",
      height: "25px",
      objectFit: "contain",
      marginRight: "8px"
    }}
  />
  <span>Marwadi Event Management</span>
</Link>



        {/* Hamburger for mobile */}
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          
          <Link to="/add-event" className="nav-item">
            Add Event
          </Link>
          <Link to="/listevent" className="nav-item">
            List Event
          </Link>
          <Link to="/calendar" className="nav-item">
            Calendar
          </Link>
         
        
       

          <Link to="/admin-more" className="nav-item">
  More
</Link>

           
            
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
