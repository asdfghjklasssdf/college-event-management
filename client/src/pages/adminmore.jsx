import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function AdminMore() {
  return (<div className="adminmore-container">
  
    <div className="links-wrapper">
      <h2 >More  analysis Options</h2>
      <Link to="/deptbook-venue" className="btn-link">Book Venue</Link>
      <Link to="/deptdownloads" className="btn-link">Downloads</Link>

      <Link to="/dept/publish-results/choose" className="btn-link">Publish Results</Link>
      <Link to="/dept/notifications" className="btn-link">Notifications</Link>
      <Link to="/dept/profile" className="btn-link">Profile</Link>
<Link to="/dept/participants/select" className="btn-link">
  View Participants
</Link>

<Link to="/dept/edit-event/select" className="btn-link">
  Edit Event
</Link>

      <Link to="/deptadd-event" className="btn-link">Add Event Departmentwise</Link>
      <Link to="/deptlist-event" className="btn-link">List Events</Link>
      <Link to="/add-department" className="btn-link">Add Department</Link>
      <Link to="/analysis" className="btn-link">Analysis</Link>
      <Link to="/admin/analytics" className="btn-link">Analytics Registration</Link>
      <Link to="/venues" className="btn-link">Venue Booking</Link>
      <Link to="/add-venue" className="btn-link">Add Venue</Link>
    </div>
    </div>
  );
}
                                                                                                       