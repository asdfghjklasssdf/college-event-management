import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { FaEnvelope, FaPhone, FaCalendarAlt, FaUsers, FaTrophy, FaStar } from "react-icons/fa";
import Navbar from "./Navbar";
import TechFestImg from "../assets/TechFest2025.png";
import CulturalNightImg from "../assets/CulturalNight.png";
import SportsMeetImg from "../assets/SportsMeet.png";
import { useNavigate } from "react-router-dom";

const StaticDashboard = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
const navigate = useNavigate();

useEffect(() => {
  const navLinks = document.querySelectorAll(".navbar a");

  // make ALL navbar links go to login
  navLinks.forEach(link => {
    link.dataset.href = link.getAttribute("href"); // store original

    // override click behaviour
    link.addEventListener("click", handleClickToLogin);
  });

  function handleClickToLogin(e) {
    e.preventDefault();
    navigate("/login");
  }

  // cleanup
  return () => {
    navLinks.forEach(link => {
      link.removeEventListener("click", handleClickToLogin);
    });
  };
}, []);

  // ⭐ Keep events OUTSIDE useEffect
  const events = [
    {
      _id: "1",
      eventName: "Tech Fest 2025",
      eventType: "Technical",
      eventDescription: "A grand celebration of innovation and technology.",
      eventDate: "2025-01-30",
      eventTime: "10:00 AM",
      venue: "Auditorium A",
      isPaid: false,
      entryFee: 0,
      posterImage: TechFestImg,
    },
    {
      _id: "2",
      eventName: "Cultural Night",
      eventType: "Cultural",
      eventDescription: "Music, dance and lots of fun.",
      eventDate: "2025-02-10",
      eventTime: "06:30 PM",
      venue: "Central Ground",
      isPaid: true,
      entryFee: 100,
      posterImage: CulturalNightImg,
    },
    {
      _id: "3",
      eventName: "Sports Meet",
      eventType: "Sports",
      eventDescription: "Annual interdepartment sports competition.",
      eventDate: "2025-02-20",
      eventTime: "09:00 AM",
      venue: "Sports Complex",
      isPaid: false,
      entryFee: 0,
      posterImage: SportsMeetImg,
    }
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      {/* Rest of UI same as before — static content */}

      {/* HERO */}
      <div className="dashboard-hero">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Manage College Events</h1>
          <h2 className="dashboard-subtitle">Like Never Before</h2>

          <p className="dashboard-description">
            Streamline event creation, registration, and management with our
            comprehensive platform designed for educational institutions.
          </p>

          <div className="dashboard-buttons">
            <Link to="/create-event" className="create-btn">Create Event</Link>
            <Link to="/events" className="browse-btn">Browse Events</Link>
          </div>

          

          <Link
  to="/login"
  style={{
    padding: "8px 18px",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
  }}
>
  Go to  Login to continue
</Link>

        </div>
      </div>

      {/* STATIC STATS */}
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

      {/* STATIC FEATURED EVENTS */}
      <div className="featured-section">
        <h2 className="featured-title">Featured Events</h2>
        <p className="featured-subtitle">
          Discover exciting upcoming events and register to secure your spot
        </p>

        <div className="featured-grid">
          {events.map(event => (
            <div key={event._id} className="featured-card">
              <img src={event.posterImage} alt={event.eventName} className="featured-image" />
              <div className="featured-info">
                <div className="featured-tags">
                  <span className="tag">{event.eventType}</span>
                  <span className="tag upcoming">Upcoming</span>
                </div>

                <h3>{event.eventName}</h3>
                <p className="featured-desc">{event.eventDescription}</p>

                <ul className="featured-details">
                  <li>📅 {new Date(event.eventDate).toDateString()}</li>
                  <li>🕓 {event.eventTime}</li>
                  <li>📍 {event.venue}</li>
                </ul>

                <p className="featured-fee">
                  {event.isPaid ? `₹${event.entryFee}` : "Free"}
                </p>

                <Link to="#" className="featured-btn">
                  Register Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                <li ><Link to="/#">Browse Events</Link></li>
                <li><Link to="/#">Dashboard</Link></li>
                <li><Link to="/#">Venues</Link></li>
                <li><Link to="/#">Analytics</Link></li>
              </ul>
            </div>
  
            <div className="footer-links">
              <h4>Support</h4>
              <ul>
                <li><Link to="/#">Help Center</Link></li>
                <li><Link to="/#">Contact Us</Link></li>
                <li><Link to="/#">Privacy Policy</Link></li>
                <li><Link to="/#">Terms of Service</Link></li>
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

export default StaticDashboard;