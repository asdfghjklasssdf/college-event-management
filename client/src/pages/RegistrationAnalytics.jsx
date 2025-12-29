import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import Navbar from "../pages/Navbar";
import "./RegistrationAnalytics.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9b59b6"];

const RegistrationAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axios.get("/api/analytics/registrations")
      .then((res) => setAnalytics(res.data))
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  return (  <>
      <div className="backgroundcontainer"></div>
    <div className="analytics-page">
      <div className="analytics-container">
        <h1>📊 Registration Analytics</h1>

        <div className="stats-summary">
          <div className="stat-card">
            <h2>Total Registrations</h2>
            <p>{analytics.totalRegistrations}</p>
          </div>
        </div>

        <div className="charts">
          {/* Top Events Chart */}
          <div className="chart-box">
            <h2>🏆 Top 5 Registered Events</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topEvents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="eventName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department-wise Pie Chart */}
          <div className="chart-box">
            <h2>🏫 Department-wise Participation</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.departmentStats}
                  dataKey="count"
                  nameKey="_id"
                  outerRadius={100}
                  label
                >
                  {analytics.departmentStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trend Chart */}
          <div className="chart-box">
            <h2>📅 Monthly Registrations</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tickFormatter={(m) => `Month ${m}`} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegistrationAnalytics;
