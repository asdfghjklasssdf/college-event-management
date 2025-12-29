import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "./EventCalendar.css";
import Navbar from "./Navbar"; // ✅ Import Navbar

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events"); // ✅ Make sure your base URL is correct
        console.log("Fetched events:", res.data);

        // ✅ Correct usage (res.data.events)
        const formatted = res.data.events.map((e) => ({
          id: e._id,
          title: `${e.eventName} (${e.eventType})`,
          start: e.eventDate,
          extendedProps: {
            time: e.eventTime,
            venue: e.venue,
            department: e.department,
            organizer: e.organizerName,
            status: e.status,
          },
        }));

        setEvents(formatted);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Unable to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventClick = (info) => {
    const id = info.event.id;
    navigate(`/events/${id}/register`);
  };

  // ✅ Loading and Error states
  if (loading) {
    return (
      <div className="calendar-fullpage">
        <Navbar />
        <h2 className="loading-text">Loading events...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-fullpage">
        <Navbar />
        <h2 className="error-text">{error}</h2>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="calendar-fullpage">
        <Navbar />
        <div className="calendar-header">
          <h1>📅 College Event Calendar</h1>
          <p>No events found. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-fullpage">
      <div className="calendar-header">
        <h1>📅 College Event Calendar</h1>
        <p>All upcoming, ongoing, and completed events at a glance.</p>
      </div>

      <div className="calendar-fullscreen">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="100%"
          expandRows={true}
          contentHeight="100%"
          aspectRatio={1.6}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          eventBackgroundColor="#16a34a"
          eventBorderColor="#15803d"
          eventTextColor="#ffffff"
          eventClassNames="calendar-event"
          eventContent={(arg) => (
            <div>
              <b>{arg.event.title}</b>
              <div className="event-time">{arg.event.extendedProps.time}</div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default EventCalendar;
