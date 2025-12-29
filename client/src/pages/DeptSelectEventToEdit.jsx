import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DeptSelectEventToEdit() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/events").then(res => setEvents(res.data.events));
  }, []);

  return (
    <div style={{ padding: 20 , color: "#007C91" }}>
      <h2>Select Event to Edit</h2>

      {events.map(e => (
        <div
          key={e._id}
          style={{
            padding: 10,
            border: "1px solid #ddd",
            marginBottom: 10,
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            color: "#007C91",
          }}
         onClick={() => {
  if (e._id && e._id.length === 24) {
    navigate(`/dept/edit-event/${e._id}`);
  } else {
    alert("This event is corrupted and cannot be edited.");
  }
}}

        >
          {e.eventName}
        </div>
      ))}
    </div>
  );
}
