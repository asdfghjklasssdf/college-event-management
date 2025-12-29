import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./AddVenue.css";

const AddVenue = () => {
  const [venue, setVenue] = useState({
    name: "",
    location: "",
    capacity: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setVenue({ ...venue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/venues", venue);
      setMessage(res.data.message || "Venue added successfully!");
      setVenue({ name: "", location: "", capacity: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="add-venue-page">
      <div className="add-venue-container">
        <h1>🏛️ Add a New Venue</h1>

        <form onSubmit={handleSubmit} className="add-venue-form">
          <input
            type="text"
            name="name"
            placeholder="Venue Name"
            value={venue.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={venue.location}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={venue.capacity}
            onChange={handleChange}
          />
          <button type="submit">Add Venue</button>
          {message && <p className="msg">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddVenue;
