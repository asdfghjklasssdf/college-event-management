import React, { useEffect, useState } from "react";
import axios from "axios";
import DepartmentNavbar from "./DepartmentNavbar";
import "./VenueBooking.css";

const DepartmentVenueBooking = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const expiry = sessionStorage.getItem("sessionExpiry");

  // 🚪 redirect if not logged in or expired
  if (!user || !token || !expiry || Date.now() > Number(expiry)) {
    sessionStorage.clear();
    window.location.href = "/login";
  }

  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [availabilityMsg, setAvailabilityMsg] = useState("");

  const [form, setForm] = useState({
    eventId: "",
    venueId: "",
    date: "",
    startTime: "",
    endTime: "",
    bookedBy: user?.fullName || "",
  });

  // Fetch venues + department-wise events
  useEffect(() => {
    axios.get("/api/venues")
      .then((res) => setVenues(res.data))
      .catch((err) => console.error("Error fetching venues:", err));

    axios.get("/api/events/department/only", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, [token]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate date & time
  const validateTime = () => {
    const { date, startTime, endTime } = form;

    if (!date || !startTime || !endTime)
      return "Please select date and time.";

    const now = new Date();
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (start < now) return "❌ Cannot book past time.";
    if (end <= start) return "❌ End time must be after start time.";

    return null;
  };

  // Auto check venue availability
  useEffect(() => {
    const { venueId, date, startTime, endTime } = form;

    if (!venueId || !date || !startTime || !endTime) return;

    axios.post("/api/venues/check-availability", {
      venueId,
      date,
      startTime,
      endTime,
    })
      .then((res) => setAvailabilityMsg(res.data.message))
      .catch(() =>
        setAvailabilityMsg("⚠️ Could not check availability.")
      );
  }, [form.venueId, form.date, form.startTime, form.endTime]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const error = validateTime();
    if (error) {
      setMessage(error);
      return;
    }

    try {
      const res = await axios.post("/api/venues/book", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="venue-page">
      <div className="venue-container">
        <h1>🏛️ Department Venue Booking</h1>

        <form onSubmit={handleSubmit} className="venue-form">

          <select name="eventId" onChange={handleChange} required>
            <option value="">Select Event</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.eventName} — ({e.eventDate?.slice(0, 10)})
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
            value={form.bookedBy}
            readOnly
          />

          {availabilityMsg && (
            <p
              className="avail-msg"
              style={{ color: availabilityMsg.includes("available") ? "green" : "red" }}
            >
              {availabilityMsg}
            </p>
          )}

          <button type="submit">Book Venue</button>

          {message && (
            <p className="msg">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DepartmentVenueBooking;
 