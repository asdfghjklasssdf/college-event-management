import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./VenueList.css";

const VenueList = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    axios.get("/api/venues")
      .then((res) => setVenues(res.data))
      .catch((err) => console.error("Error fetching venues:", err));
  }, []);

  return (
    <div className="venue-page">
      <div className="venue-container">
        <h1>🏫 Available Venues</h1>
        <div className="venue-list">
          {venues.map((v) => (
            <div className="venue-card" key={v._id}>
              <h2>{v.name}</h2>
              <p>{v.location}</p>
              <p>Capacity: {v.capacity}</p>
              <p>{v.description}</p>
              <p>
                Status:{" "}
                <b style={{ color: v.isAvailable ? "green" : "red" }}>
                  {v.isAvailable ? "Available" : "Booked"}
                </b>
              </p>
              <a href={`/book-venue/${v._id}`} className="book-btn">Book Venue</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueList;
