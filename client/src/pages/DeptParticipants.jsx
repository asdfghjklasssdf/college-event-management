import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Participants.css";

const DeptParticipants = () => {
  const { eventId } = useParams();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
    const token = sessionStorage.getItem("token");

      // 🚪 no session → go to login
      if (!token) {
        window.location.href = "/login";
        return;
      }      const res = await axios.get(`/api/registrations/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParticipants(res.data);
    };
    fetchParticipants();
  }, [eventId]);

  return (
    <div className="participants-container">
      <h1>Participants List</h1>

      {participants.length === 0 && <p>No participants yet.</p>}

      <table className="participants-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>College ID</th>
            <th>Department</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.collegeId}</td>
              <td>{p.department}</td>
              <td>{p.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeptParticipants;
