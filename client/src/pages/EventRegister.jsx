import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventRegister.css";
 import Navbar from "./Navbar"; // ✅ Import Navbar

const EventRegister = () => {
  const { id } = useParams(); // eventId
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    collegeId: "",
    department: "",
    year: "",
  });
  const [message, setMessage] = useState("");

  // Fetch event details
 useEffect(() => {
  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${id}`); // 👈 directly get by id
      setEvent(res.data); // 👈 assign directly
    } catch (err) {
      console.error("Error fetching event:", err);
    }
  };
  fetchEvent();
}, [id]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/registrations/register", {
        eventId: id,
        ...form,
      });
      setMessage(res.data.message || "Registered successfully!");
    } catch (err) {
      console.error("Error:", err);
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  if (!event) return <p>Loading event details...</p>;

   return (
    <div className="register-page">

      <div className="register-hero">
        <h1>Register for {event.eventName}</h1>
        <p>
          Join us for an exciting {event.eventType} event organized by{" "}
          <b>{event.organizerName}</b>!
        </p>
      </div>

      <div className="register-container">
        {/* LEFT SIDE - EVENT DETAILS */}
        <div className="event-details">
          {event.posterImage && (
            <img
              src={event.posterImage}
              alt={event.eventName}
              className="event-poster"
            />
          )}
          <h2>{event.eventName}</h2>
          <ul>
            <li>📅 {new Date(event.eventDate).toDateString()}</li>
            <li>🕓 {event.eventTime}</li>
            <li>📍 {event.venueName}</li>
            <li>🏫 {event.department}</li>
            <li>👤 Organizer: {event.organizerName}</li>
            {event.isPaid ? (
              <li>💰 Entry Fee: ₹{event.entryFee}</li>
            ) : (
              <li>🆓 Free Entry</li>
            )}
          </ul>
          <p className="event-desc">{event.eventDescription}</p>
        </div>

        {/* RIGHT SIDE - REGISTRATION FORM */}
        <form onSubmit={handleSubmit} className="register-form">
          <h2>📝 Registration Form</h2>

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
          />
          <input
            name="collegeId"
            placeholder="College ID"
            onChange={handleChange}
          />
          <input
            name="department"
            placeholder="Department"
            onChange={handleChange}
          />
          <input
            name="year"
            placeholder="Year"
            onChange={handleChange}
          />

          <button type="submit">Submit Registration</button>

          {message && <p className="success">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default EventRegister;