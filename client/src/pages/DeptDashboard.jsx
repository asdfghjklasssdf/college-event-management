import React, { useEffect, useState } from "react";
import DepartmentNavbar from "./DepartmentNavbar";
import axios from "axios";
import "./DepartmentDashboard.css";

const DeptDashboard = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));



  // ✅ proper logout for session-based auth
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };


  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    completedEvents: 0,
    ongoingEvents: 0,
    upcomingEvents: 0,
  });

  const [upcomingList, setUpcomingList] = useState([]);
  const [todayEvent, setTodayEvent] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetchStats = async () => {
      const eventRes = await axios.get("/api/events/department/stats/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const participantRes = await axios.get("/api/registrations/department/total", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch all department events
      const deptEventsRes = await axios.get("/api/events/department/only", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const events = deptEventsRes.data;

      // Count by status
      const completedEvents = events.filter(e => e.status === "Completed").length;
      const ongoingEvents = events.filter(e => e.status === "Ongoing").length;
      const upcomingEvents = events.filter(e => e.status === "Upcoming").length;

      // Upcoming next 3 events
      const nextEvents = events
        .filter(e => e.status === "Upcoming")
        .slice(0, 3);

      // Check if event today
      const today = new Date().toDateString();
      const todayEvt = events.find(e => new Date(e.eventDate).toDateString() === today);

      setStats({
        totalEvents: eventRes.data.totalEvents,
        totalParticipants: participantRes.data.totalParticipants,
        completedEvents,
        ongoingEvents,
        upcomingEvents,
      });

      setUpcomingList(nextEvents);
      setTodayEvent(todayEvt || null);
    };

    fetchStats();
  }, []);
if (!user) {
  sessionStorage.clear();
  window.location.href = "/login";
  return null;
}
  return (
    <div className="dept-dashboard">
      {/* HEADER */}
      <DepartmentNavbar /> 

      <div className="header">
        <h1>Welcome {user.fullName}</h1>
        <p>
          Department: <b>{user.department}</b>
        </p>
          <button onClick={handleLogout} className="logout-btn">
            Logout ({user?.fullName || "User"})
          </button>
      </div>

      {/* MAIN SUMMARY CARDS */}
      <div className="dept-cards">
        <div className="dept-card blue">
          <h2>{stats.totalEvents}</h2>
          <p>Total Events Created</p>
        </div>

        <div className="dept-card green">
          <h2>{stats.totalParticipants}</h2>
          <p>Total Participants Registered</p>
        </div>

        <div className="dept-card purple">
          <h2>{stats.ongoingEvents}</h2>
          <p>Ongoing Events</p>
        </div>

        <div className="dept-card orange">
          <h2>{stats.completedEvents}</h2>
          <p>Completed Events</p>
        </div>
      </div>

      {/* TODAY'S EVENT */}
      {todayEvent && (
        <div className="today-event-box">
          <h3>📅 Today's Event</h3>
          <p><b>{todayEvent.eventName}</b></p>
          <p>{todayEvent.eventTime}</p>
        </div>
      )}

      {/* UPCOMING EVENTS LIST */}
      <div className="upcoming-container">
        <h2>Upcoming Events</h2>

        {upcomingList.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <div className="upcoming-list">
            {upcomingList.map((e) => (
              <div key={e._id} className="upcoming-card">
                <h4>{e.eventName}</h4>
                <p>{new Date(e.eventDate).toDateString()}</p>
                <p>⏰ {e.eventTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK LINKS */}
      <div className="quick-links">
        <a href="/deptadd-event" className="quick-card">➕ Add Event</a>
        <a href="/deptlist-event" className="quick-card">📄 View Events</a>
        <a href="/deptbook-venue" className="quick-card">📌 Book Venue</a>
        <a href="/deptdownloads" className="quick-card">📥 Download CSV</a>
        <a href="/dept/profile" className="quick-card">👤 Profile</a>
      </div>

    </div>
  );
};

export default DeptDashboard;
