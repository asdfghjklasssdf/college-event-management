import React from "react";
import { Link } from "react-router-dom";
import "./RoleSelection.css"; // Make sure to import CSS

const RoleSelection = () => {
  return (
    <div className="role-page">
      <div className="role-box">
        <h1>Select Portal</h1>
        <p>Please choose your role to continue</p>

        <div className="role-buttons">
          
          {/* Student */}
          <Link to="/static-dashboard" className="role-btn student">
            Student
          </Link>

          {/* Admin */}
          <Link to="/Adminlogin" className="role-btn admin">
            Admin
          </Link>

        </div>

      </div>
    </div>
  );
};

export default RoleSelection;
