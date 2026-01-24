import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./EventListDept.css";

const DeptSelectEventParticipants = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
   const token = sessionStorage.getItem("token");

    // if no token -> force login
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("/api/events/department/only", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className="eventlist-container">
        <h1 style={{
                  color: "white",
                }}>Select Event to View Participants</h1>

        {events.length === 0 && <p>No events found.</p>}

        <div className="event-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h2>{event.eventName}</h2>
              <p>{new Date(event.eventDate).toDateString()}</p>

              <Link
                to={`/dept/participants/${event._id}`}
                className="event-btn"
                style={{
                  padding: "10px",
                  background: "#009CA6",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                View Participants →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeptSelectEventParticipants;
