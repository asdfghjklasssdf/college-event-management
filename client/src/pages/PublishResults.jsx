import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PublishResults.css";

const PublishResults = () => {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [results, setResults] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
       const token = sessionStorage.getItem("token");

    // optional safety – if no token, redirect to login
    if (!token) {
      window.location.href = "/login";
      return;
    }
    axios
      .get("/api/events/department/only", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId) return alert("Please select an event!");

    const token = sessionStorage.getItem("token");

    const res = await axios.post(
      "/api/events/publish-results",
      { eventId, results },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessage(res.data.message);
    setResults("");
  };

  return (
    <div className="results-container">
      <div className="results-card">

        <h1>📢 Publish Event Results</h1>

        <div className="input-group">
          <label>📌 Select Event</label>
          <select
            className="event-select"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Choose Event</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.eventName}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <label>📝 Results</label>
          <textarea
            placeholder="Enter the event results..."
            value={results}
            onChange={(e) => setResults(e.target.value)}
            required
          ></textarea>

          <button type="submit">
            🚀 Publish Results
          </button>
        </form>

        {message && <p className="success">✅ {message}</p>}
      </div>
    </div>
  );
};

export default PublishResults;
