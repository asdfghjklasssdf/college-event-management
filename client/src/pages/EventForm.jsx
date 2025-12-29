import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventForm.css";
import Navbar from "./Navbar";
import DepartmentNavbar from "./DepartmentNavbar";   // ✅ ADDED


const EventForm = ({ departmentPanel = false }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "Technical",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
      eventEndTime: "",   // ✅ NEW FIELD
    venue: "",
    organizerName: "",
    department: departmentPanel ? user.department : "",  
    registrationLink: "",
    maxParticipants: "",
    isPaid: false,
    entryFee: "",
    contactPerson: "",
    contactEmail: "",
    contactNumber: "",
    status: "Upcoming",
  });
  const [posterImage, setPosterImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
 const [venues, setVenues] = useState([]); // ✅ define before useEffect
  const [venueAvailability, setVenueAvailability] = useState(""); // ✅ define before useEffect
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("/api/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
   fetchDepartments();
  }, [departmentPanel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPosterImage(file);
    setPreview(URL.createObjectURL(file));
  };

    // ✅ Fetch Venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get("/api/venues");
        setVenues(res.data);
      } catch (err) {
        console.error("Error fetching venues:", err);
      }
    };
    fetchVenues();
  }, []);

  // ✅ Check Venue Availability Automatically
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.venue || !formData.eventDate || !formData.eventTime) return;

      try {
        const res = await axios.post("/api/venues/check-availability", {
          venueId: formData.venue,
          date: formData.eventDate,
          startTime: formData.eventTime,
          endTime: formData.eventTime,
        });

        setVenueAvailability(res.data.message);
      } catch (err) {
        console.error("Error checking venue availability:", err);
        setVenueAvailability("⚠️ Could not check venue availability.");
      }
    };

    checkAvailability();
  }, [formData.venue, formData.eventDate, formData.eventTime]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (posterImage) data.append("posterImage", posterImage);

      const res = await axios.post("/api/events/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };
  return ( 
    <div>
    <div className="eventform-container">
         

      <div className="eventform-hero">
        <h1>Create New Event 🎉</h1>
        <p>Fill in the details below to add your event to the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="eventform-card">
        <div className="grid-2">
          <input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={formData.eventName}
            onChange={handleChange}
            required
          />

          <select name="eventType" value={formData.eventType} onChange={handleChange}>
            <option>Technical</option>
            <option>Cultural</option>
            <option>Sports</option>
            <option>Workshop</option>
            <option>Seminar</option>
            <option>Other</option>
          </select>
        </div>

        <textarea
          name="eventDescription"
          placeholder="Event Description"
          value={formData.eventDescription}
          onChange={handleChange}
          required
        ></textarea>

       <div className="grid-2">
  <input
    type="date"
    name="eventDate"
    value={formData.eventDate}
    onChange={handleChange}
    required
  />

  <input
    type="time"
    name="eventTime"
    value={formData.eventTime}
    onChange={handleChange}
    required
  />
</div>

{/* NEW ROW FOR END TIME */}
<div className="grid-2">
  <input
    type="time"
    name="eventEndTime"
    value={formData.eventEndTime}
    onChange={handleChange}
    required
  />
</div>


  {/* ✅ Venue dropdown with availability check */}
          <div className="grid-2">
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            >
              <option value="">Select Venue</option>
              {venues.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name} — {v.location}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="organizerName"
              placeholder="Organizer Name"
              value={formData.organizerName}
              onChange={handleChange}
              required
            />
          </div>

          {venueAvailability && (
            <p
              style={{
                color: venueAvailability.includes("available") ? "green" : "red",
                fontWeight: "bold",
                marginTop: "-5px",
              }}
            >
              {venueAvailability}
            </p>
          )}
 <div className="grid-2">
            {/* ✅ AUTO-HIDE DEPARTMENT FIELD */}
            {!departmentPanel ? (
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={user.department}
                disabled
                className="disabled-input"
              />
            )}
          <input
            type="url"
            name="registrationLink"
            placeholder="Registration Link"
            value={formData.registrationLink}
            onChange={handleChange}
          />
        </div>

        <div className="grid-2">
          <input
            type="number"
            name="maxParticipants"
            placeholder="Max Participants"
            value={formData.maxParticipants}
            onChange={handleChange}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
            />
            Paid Event?
          </label>
        </div>

        {formData.isPaid && (
          <input
            type="number"
            name="entryFee"
            placeholder="Entry Fee (₹)"
            value={formData.entryFee}
            onChange={handleChange}
          />
        )}

        <div className="grid-3">
          <input
            type="text"
            name="contactPerson"
            placeholder="Contact Person"
            value={formData.contactPerson}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={formData.contactEmail}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </div>

        <div className="grid-2">
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>

          <input type="file" name="posterImage" onChange={handleImageChange} />
        </div>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Event"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
    </div>
  );
};

export default EventForm;