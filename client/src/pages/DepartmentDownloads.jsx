import React from "react";
import DepartmentNavbar from "./DepartmentNavbar";
import axios from "axios";
import "./Download.css";

const DepartmentDownloads = () => {
 const token = sessionStorage.getItem("token");
  const expiry = sessionStorage.getItem("sessionExpiry");

  // 🔐 redirect if session missing or expired
  if (!token || !expiry || Date.now() > Number(expiry)) {
    sessionStorage.clear();
    window.location.href = "/login";
  }
  const downloadFile = async (path, filename) => {
    try {
      const res = await axios.get(path, {
        responseType: "blob", // IMPORTANT
        headers: {
          Authorization: `Bearer ${token}`, // Send token correctly
        },
      });

      // Create a Blob URL
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Create a link & auto click it
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed");
    }
  };

  return (
    <div className="download">
      <div className="download-container">
        <h1>Download Department Reports</h1>

        <button
          onClick={() =>
            downloadFile("/api/download/events/csv", "department_events.csv")
          }
        >
          📥 Download Event List (CSV)
        </button>

        <button
          onClick={() =>
            downloadFile(
              "/api/download/registrations/csv",
              "event_registrations.csv"
            )
          }
        >
          📥 Download Registrations (CSV)
        </button>

        <button
          onClick={() =>
            downloadFile("/api/download/venues/csv", "venue_bookings.csv")
          }
        >
          📥 Download Venue Bookings (CSV)
        </button>
      </div>
    </div>
  );
};

export default DepartmentDownloads;
