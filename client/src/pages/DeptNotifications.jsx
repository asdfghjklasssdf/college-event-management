import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const DeptNotifications = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [message, setMessage] = useState("");
  const [sentMessage, setSentMessage] = useState("");

  useEffect(() => {
 const token = sessionStorage.getItem("token");

    // 🚪 if not logged in, redirect
    if (!token) {
      window.location.href = "/login";
      return;
    }
    // Fetch department events
    axios
      .get("/api/events/department/only", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  const sendNotification = async () => {
    if (!selectedEvent) {
      alert("Please select an event!");
      return;
    }
    if (!message.trim()) {
      alert("Message cannot be empty!");
      return;
    }

 const token = sessionStorage.getItem("token");

    // 🚪 extra guard
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const res = await axios.post(
      "/api/notifications/send",
      { eventId: selectedEvent, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSentMessage(res.data.message);
    setMessage("");
    setSelectedEvent("");
  };

  return (
<div className="notify-page">
  <div className="notify-container">
      <h1>Send Notification</h1>

      {/* EVENT DROPDOWN */}
      <select
        className="event-select"
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">Select Event</option>
        {events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.eventName}
          </option>
        ))}
      </select>

      {/* MESSAGE BOX */}
      <textarea
        placeholder="Write your notification message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      <button onClick={sendNotification}>Send Notification</button>

      {sentMessage && <p className="success">{sentMessage}</p>}
    </div>
      </div>

  );
};

export default DeptNotifications;
