import React, { useEffect, useState } from "react";
import axios from "axios";
import DepartmentNavbar from "./DepartmentNavbar";
import "./EventListDept.css"; // optional CSS

const DepartmentEventList = () => {
  const [events, setEvents] = useState([]);

  // Fetch department events
  useEffect(() => {
const token = sessionStorage.getItem("token");

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

  // --------------------------
  // UPDATE STATUS FUNCTION
  // --------------------------
  const updateStatus = async (id, newStatus) => {
    const token = sessionStorage.getItem("token");

    await axios.patch(
      `/api/events/update-status/${id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Status updated!");
    window.location.reload();
  };

  // --------------------------
  // DELETE EVENT FUNCTION
  // --------------------------
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const token = sessionStorage.getItem("token");

    await axios.delete(`/api/events/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Event deleted!");
    window.location.reload();
  };

  // --------------------------
  // EXTEND DEADLINE FUNCTION
  // --------------------------
  const extendDeadline = async (id, deadline) => {
    const token = sessionStorage.getItem("token");

    await axios.patch(
      `/api/events/extend-deadline/${id}`,
      { registrationDeadline: deadline },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Registration deadline updated!");
    window.location.reload();
  };

  return (
    <div>

      <div className="eventlist-container">
        <h1>Your Department Events</h1>

        {events.length === 0 && <p>No events found.</p>}

        <div className="event-grid">
          {events.map((e) => (
            <div key={e._id} className="event-card">
              <h2>{e.eventName}</h2>
              <p>{e.eventDescription}</p>
              <p>
                Status: <b>{e.status}</b>
              </p>
              <p>Date: {new Date(e.eventDate).toDateString()}</p>

              {/* -------------------------------
                  STATUS UPDATE DROPDOWN 
              -------------------------------- */}
              <label>Status:</label>
              <select
                value={e.status}
                onChange={(ev) => updateStatus(e._id, ev.target.value)}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              {/* -------------------------------
                  EXTEND DEADLINE
              -------------------------------- */}
              <label>Extend Registration Deadline:</label>
              <input
                type="datetime-local"
                onChange={(ev) => extendDeadline(e._id, ev.target.value)}
              />

              {/* -------------------------------
                 EDIT BUTTON
              -------------------------------- */}
              <button
                className="edit-btn"
                onClick={() =>
                  (window.location.href = `/dept/edit-event/${e._id}`)
                }
              >
                ✏ Edit
              </button>

              {/* -------------------------------
                  DELETE BUTTON
              -------------------------------- */}
              <button
                className="delete-btn"
                onClick={() => deleteEvent(e._id)}
              >
                ❌ Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentEventList;
