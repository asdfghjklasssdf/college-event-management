import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./EventList.css";
import Navbar from "./Navbar";

const months = [
  { val: "", label: "All Months" },
  { val: "1", label: "January" },
  { val: "2", label: "February" },
  { val: "3", label: "March" },
  { val: "4", label: "April" },
  { val: "5", label: "May" },
  { val: "6", label: "June" },
  { val: "7", label: "July" },
  { val: "8", label: "August" },
  { val: "9", label: "September" },
  { val: "10", label: "October" },
  { val: "11", label: "November" },
  { val: "12", label: "December" },
];

const currentYear = new Date().getFullYear();
const years = [{ val: "", label: "All Years" }];
for (let y = currentYear; y >= 2000; y--) years.push({ val: String(y), label: String(y) });

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]); // ✅ moved inside component
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    department: "",
    status: "",
    year: "",
    month: "",
    day: "",
    page: 1,
    limit: 100,
  });

  // ✅ Fetch departments list from backend
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters)
            .filter(([_, v]) => v !== "" && v !== null && v !== undefined)
            .map(([k, v]) => [k, String(v)])
        )
      ).toString();

      const res = await axios.get(`/api/events?${queryParams}`);
      setEvents(res.data.events || res.data);
      setTotal(res.data.total ?? (res.data.events ? res.data.events.length : 0));
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchDepartments(); // ✅ also load departments once
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchEvents();
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      department: "",
      status: "",
      year: "",
      month: "",
      day: "",
      page: 1,
      limit: 100,
    });
    setTimeout(fetchEvents, 0);
  };

  if (loading) return <p className="loading">Loading events...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!events || events.length === 0) return <p className="empty">No events found 😞</p>;

  return (
    <div>
      <div className="eventlist-container">
        <div className="eventlist-header">
          <h1>🎉 All College Events</h1>
          <p>Browse and explore events — filter by department, status, or date.</p>
        </div>

        <form onSubmit={handleSearch} className="filter-bar">
          <input
            type="text"
            name="search"
            placeholder="Search by event name..."
            value={filters.search}
            onChange={handleChange}
          />

          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">All Types</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Other">Other</option>
          </select>

          {/* ✅ Department dropdown dynamically populated */}
          <select
            name="department"
            value={filters.department}
            onChange={handleChange}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <select name="year" value={filters.year} onChange={handleChange}>
            {years.map((y) => (
              <option key={y.val} value={y.val}>
                {y.label}
              </option>
            ))}
          </select>

          <select name="month" value={filters.month} onChange={handleChange}>
            {months.map((m) => (
              <option key={m.val} value={m.val}>
                {m.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="day"
            placeholder="Day"
            min="1"
            max="31"
            value={filters.day}
            onChange={handleChange}
            style={{ width: 80 }}
          />

          <button type="submit">Apply</button>
          <button type="button" onClick={resetFilters} style={{ marginLeft: 8 }}>
            Reset
          </button>
        </form>

        <div className="summary">
          <p>
            Showing <strong>{events.length}</strong> of <strong>{total}</strong> events.
          </p>
        </div>

        <div className="event-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              {event.posterImage && (
                <img
                  src={event.posterImage}
                  alt={event.eventName}
                  className="event-img"
                />
              )}

              <div className="event-info">
                <div className="event-tags">
                  <span className="tag">{event.eventType}</span>
                  <span className={`tag status ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                </div>

                <h3>{event.eventName}</h3>
                <p className="event-desc">
                  {event.eventDescription?.slice(0, 90)}...
                </p>

                <ul className="event-details">
                  <li>📅 {new Date(event.eventDate).toLocaleDateString()}</li>
                  <li>🕒 {event.eventTime}</li>
                 <li>📍 {event.venueName || event.venue}</li>

                  <li>👤 {event.organizerName}</li>
                </ul>

                <p className="event-fee">
                  {event.isPaid ? `₹${event.entryFee}` : "Free Entry"}
                </p>

                {new Date(`${event.eventDate}`).getTime() + 
  new Date(`1970-01-01T${event.eventTime}`).getTime() - 
  new Date('1970-01-01T00:00').getTime() > Date.now() ? (
  <Link to={`/events/${event._id}/register`} className="event-btn">
    Register Now →
  </Link>
) : (
  <button className="event-btn disabled" disabled>
    Registration Closed
  </button>
)}

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;
