import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeptEditEvent.css";
import { useParams } from "react-router-dom";

const DeptEditEvent = () => {
  const { id } = useParams();

  const [eventData, setEventData] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

useEffect(() => {
  if (!id || id.length !== 24) {
    console.log("Invalid id from route:", id);
    setError("Invalid event ID. This event cannot be edited.");
    setLoading(false);
    return;
  }

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${id}`);
      setEventData(res.data);
    } catch (err) {
      console.log("Fetch event error:", err.response?.data || err.message);
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  fetchEvent();
}, [id]);


  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await axios.patch(`/api/events/edit/${id}`, eventData);
      setMessage("Event updated successfully 🎉");
    } catch (err) {
      console.log("Update error:", err.response?.data || err.message);
      setError("Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Loading event...</div>;

  return (
    <div className="edit-wrapper">
      <div className="edit-card">
        <h2>Edit Event</h2>
        <p className="subtitle">{eventData.eventName}</p>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert danger">{error}</div>}

<form onSubmit={handleSubmit} className="form-grid">

  {/* Event Name */}
  <div className="form-group">
    <label>Event Name</label>
    <input
      name="eventName"
      value={eventData.eventName || ""}
      onChange={handleChange}
      required
    />
  </div>

  {/* Event Type */}
  <div className="form-group">
    <label>Event Type</label>
    <select
      name="eventType"
      value={eventData.eventType || ""}
      onChange={handleChange}
    >
      <option value="">Select type</option>
      <option value="Technical">Technical</option>
      <option value="Cultural">Cultural</option>
      <option value="Sports">Sports</option>
      <option value="Workshop">Workshop</option>
      <option value="Seminar">Seminar</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* Description */}
  <div className="form-group full">
    <label>Description</label>
    <textarea
      name="eventDescription"
      value={eventData.eventDescription || ""}
      onChange={handleChange}
      rows={3}
    />
  </div>

  {/* Date */}
  <div className="form-group">
    <label>Date</label>
    <input
      type="date"
      name="eventDate"
      value={
        eventData.eventDate
          ? new Date(eventData.eventDate).toISOString().slice(0, 10)
          : ""
      }
      onChange={handleChange}
    />
  </div>

  {/* Time */}
  <div className="form-group">
    <label>Start Time</label>
    <input
      type="time"
      name="eventTime"
      value={eventData.eventTime || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label>End Time</label>
    <input
      type="time"
      name="eventEndTime"
      value={eventData.eventEndTime || ""}
      onChange={handleChange}
    />
  </div>

  {/* Venue */}
  <div className="form-group">
    <label>Venue</label>
    <input
      name="venue"
      value={eventData.venue || ""}
      onChange={handleChange}
    />
  </div>

  {/* Organizer */}
  <div className="form-group">
    <label>Organizer Name</label>
    <input
      name="organizerName"
      value={eventData.organizerName || ""}
      onChange={handleChange}
    />
  </div>

  {/* Department */}
  <div className="form-group">
    <label>Department</label>
    <input
      name="department"
      value={eventData.department || ""}
      onChange={handleChange}
    />
  </div>

  {/* Registration Link */}
  <div className="form-group full">
    <label>Registration Link</label>
    <input
      name="registrationLink"
      value={eventData.registrationLink || ""}
      onChange={handleChange}
    />
  </div>

  {/* Poster Image URL */}
  <div className="form-group full">
    <label>Poster Image URL</label>
    <input
      name="posterImage"
      value={eventData.posterImage || ""}
      onChange={handleChange}
    />
  </div>

  {/* Max Participants */}
  <div className="form-group">
    <label>Max Participants</label>
    <input
      type="number"
      name="maxParticipants"
      value={eventData.maxParticipants || 0}
      onChange={handleChange}
    />
  </div>

  {/* Paid / Free */}
  <div className="form-group">
    <label>Is Paid?</label>
    <select
      name="isPaid"
      value={eventData.isPaid ? "true" : "false"}
      onChange={(e) =>
        setEventData({
          ...eventData,
          isPaid: e.target.value === "true",
        })
      }
    >
      <option value="false">No</option>
      <option value="true">Yes</option>
    </select>
  </div>

  {/* Entry Fee */}
  <div className="form-group">
    <label>Entry Fee</label>
    <input
      type="number"
      name="entryFee"
      value={eventData.entryFee || 0}
      onChange={handleChange}
    />
  </div>

  {/* Contact Details */}
  <div className="form-group">
    <label>Contact Person</label>
    <input
      name="contactPerson"
      value={eventData.contactPerson || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label>Contact Email</label>
    <input
      name="contactEmail"
      value={eventData.contactEmail || ""}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label>Contact Number</label>
    <input
      name="contactNumber"
      value={eventData.contactNumber || ""}
      onChange={handleChange}
    />
  </div>

  {/* Status */}
  <div className="form-group">
    <label>Status</label>
    <select
      name="status"
      value={eventData.status || "Upcoming"}
      onChange={handleChange}
    >
      <option value="Upcoming">Upcoming</option>
      <option value="Ongoing">Ongoing</option>
      <option value="Completed">Completed</option>
    </select>
  </div>

  <button className="save-btn" type="submit" disabled={saving}>
    {saving ? "Saving..." : "Save Changes"}
  </button>
</form>

      </div>
    </div>
  );
};

export default DeptEditEvent;
