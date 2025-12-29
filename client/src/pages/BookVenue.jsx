import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./BookVenue.css";

const BookVenue = () => {
  const { id } = useParams(); // venueId
  const [form, setForm] = useState({ eventId: "", date: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/venues/book", {
        venueId: id,
        eventId: form.eventId,
        date: form.date,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="book-venue-page">
      <div className="book-form-container">
        <h1>📅 Book Venue</h1>
        <form onSubmit={handleSubmit}>
          <label>Event ID</label>
          <input name="eventId" onChange={handleChange} required />
          <label>Date</label>
          <input type="date" name="date" onChange={handleChange} required />
          <button type="submit">Book</button>
        </form>
        {message && <p className="msg">{message}</p>}
      </div>
    </div>
  );
};

export default BookVenue;
