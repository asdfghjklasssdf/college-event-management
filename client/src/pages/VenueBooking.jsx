// VenueBooking.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./VenueBooking.css";

const VenueBooking = () => {
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    eventId: "",
    venueId: "",
    date: "",
    startTime: "",
    endTime: "",
    bookedBy: "",
  });
  const [message, setMessage] = useState("");


  const validateTime = () => {
  const { date, startTime, endTime } = form;

  if (!date || !startTime || !endTime) return "Please select all date and time fields.";

  const now = new Date();
  const startDateTime = new Date(`${date}T${startTime}`);
  const endDateTime = new Date(`${date}T${endTime}`);

  if (startDateTime < now) {
    return "❌ You cannot book for a past date or time.";
  }
  if (endDateTime <= startDateTime) {
    return "❌ End time must be later than start time.";
  }
  return null;
};

  useEffect(() => {
    axios.get("/api/venues").then((res) => setVenues(res.data));
axios.get("/api/events").then((res) => setEvents(res.data.events || []));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationError = validateTime();
  if (validationError) {
    setMessage(validationError);
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "/api/venues/book",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessage(res.data.message);
  } catch (err) {
    setMessage(err.response?.data?.message || "Server error");
  }
};



  return (
    <div className="venue-page">
      <div className="venue-container">
        <h1>🏛️ Book a Venue</h1>

        <form onSubmit={handleSubmit} className="venue-form">
          <select name="eventId" onChange={handleChange} required>
            <option value="">Select Event</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.eventName}
              </option>
            ))}
          </select>

          <select name="venueId" onChange={handleChange} required>
            <option value="">Select Venue</option>
            {venues.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} — {v.location}
              </option>
            ))}
          </select>

          <input type="date" name="date" onChange={handleChange} required />
          <input type="time" name="startTime" onChange={handleChange} required />
          <input type="time" name="endTime" onChange={handleChange} required />
          <input
            type="text"
            name="bookedBy"
            placeholder="Booked By"
            onChange={handleChange}
          />

          <button type="submit">Book Venue</button>
          {message && <p className="msg">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default VenueBooking;
