import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import { FaEnvelope,  FaPhone ,FaCalendarAlt, FaUsers, FaTrophy, FaStar } from "react-icons/fa";
 import Navbar from "./Navbar"; // ✅ Import Navbar

const Dashboard = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const expiry = sessionStorage.getItem("sessionExpiry");

  // 🔐 redirect to login if no active session
  if (!user || !token || !expiry || Date.now() > Number(expiry)) {
    sessionStorage.clear();
    window.location.href = "/login";
  }
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };
  // Fetch events for "Featured Events"
  // Fetch events for "Featured Events"
useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events");
      console.log("Fetched Events:", res.data);

      // ✅ Access the correct key from backend
      const fetchedEvents = Array.isArray(res.data.events) ? res.data.events : [];

      // ✅ Only first 3 upcoming events
      setEvents(fetchedEvents.slice(0, 3));
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };
  fetchEvents();
}, []);


  return (
    <div className="dashboard-page">
      {/* HERO SECTION */}
      <div className="dashboard-hero">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Manage College Events</h1>
          <h2 className="dashboard-subtitle">Like Never Before</h2>
          <p className="dashboard-description">
            Streamline event creation, registration, and management with our
            comprehensive platform designed for educational institutions.
          </p>

          <div className="dashboard-buttons">
            <Link to="/create-event" className="create-btn">
              Create Event
            </Link>
            <Link to="/events" className="browse-btn">
              Browse Events
            </Link>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            Logout ({user?.fullName || "User"})
          </button>
        </div>
      </div>

      {/* STATS SECTION (Only 3 cards) */}
     <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <FaCalendarAlt className="stat-icon green" />
            <h3>Total Events</h3>
            <p className="stat-value">156</p>
            <span className="stat-growth">+12% vs last month</span>
          </div>

          <div className="stat-card">
            <FaUsers className="stat-icon blue" />
            <h3>Active Users</h3>
            <p className="stat-value">2,847</p>
            <span className="stat-growth">+8% vs last month</span>
          </div>

          <div className="stat-card">
            <FaTrophy className="stat-icon yellow" />
            <h3>Events This Month</h3>
            <p className="stat-value">24</p>
            <span className="stat-growth">+15% vs last month</span>
          </div>

          <div className="stat-card">
            <FaStar className="stat-icon lime" />
            <h3>Average Rating</h3>
            <p className="stat-value">4.8</p>
            <span className="stat-growth">+3% vs last month</span>
          </div>
        </div>
      </div>

      {/* FEATURED EVENTS SECTION */}
      <div className="featured-section">
        <h2 className="featured-title">Featured Events</h2>
        <p className="featured-subtitle">
          Discover exciting upcoming events and register to secure your spot
        </p>

        {loading ? (
          <p className="loading-text">Loading events...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="featured-grid">
            {events.map((event) => (
              <div key={event._id} className="featured-card">
                {event.posterImage && (
                  <img
                    src={event.posterImage}
                    alt={event.eventName}
                    className="featured-image"
                  />
                )}
                <div className="featured-info">
                  <div className="featured-tags">
                    <span className="tag">{event.eventType}</span>
                    <span className="tag upcoming">Upcoming</span>
                  </div>
                  <h3>{event.eventName}</h3>
                  <p className="featured-desc">
                    {event.eventDescription?.slice(0, 80)}...
                  </p>
                  <ul className="featured-details">
                    <li>📅 {new Date(event.eventDate).toDateString()}</li>
                    <li>🕓 {event.eventTime}</li>
                    <li>📍 {event.venue}</li>
                  </ul>
                  <p className="featured-fee">
                    {event.isPaid ? `₹${event.entryFee}` : "Free"}
                  </p>
                  <Link
                    to={`/events/${event._id}/register`}
                    className="featured-btn"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="view-all">
          <Link to="/events" className="view-all-btn">
            View All Events →
          </Link>
        </div>
      </div>

        <div className="why-section">
        <h2>Why Choose EventHub?</h2>
        <p className="why-subtext">
          Everything you need to manage successful college events
        </p>

        <div className="why-grid">
          <div className="why-card">
            <FaCalendarAlt className="why-icon green" />
            <h3>Easy Event Creation</h3>
            <p>
              Create and manage events with our intuitive interface and powerful tools.
            </p>
          </div>

          <div className="why-card">
            <FaUsers className="why-icon blue" />
            <h3>Registration Management</h3>
            <p>
              Handle registrations, payments, and attendee communication seamlessly.
            </p>
          </div>

          <div className="why-card">
            <FaTrophy className="why-icon yellow" />
            <h3>Analytics & Insights</h3>
            <p>
              Track event performance and gain valuable insights with detailed analytics.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-about">
            <h3 className="footer-logo">
              <FaCalendarAlt className="footer-icon" /> EventHub
            </h3>
            <p>
              Streamline your college events with our comprehensive management system. 
              Create, manage, and track events with ease.
            </p>
            <p><FaEnvelope /> info@eventhub.edu</p>
            <p><FaPhone /> +1 (555) 123-4567</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li ><Link to="/events">Browse Events</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/venues">Venues</Link></li>
              <li><Link to="/analytics">Analytics</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 MARWADI UNIVERSITY. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
