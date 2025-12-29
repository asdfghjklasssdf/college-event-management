import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import Navbar from "./Navbar";
import "./AnalysisDashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#E63946"];

const AnalysisDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (!data) return <p>No data available</p>;

  const { totalEvents, statusCounts, departmentCounts, monthlyCounts, paidStats } = data;

  return (  <>
      <div className="backgroundcontainer"></div>
    <div className="analysis-page ">
      <div className="analysis-container">
        <h1>📈 Event Analytics Dashboard</h1>
        <p>Real-time insights from your MongoDB cluster</p>

        <div className="cards">
          <div className="card">
            <h3>Total Events</h3>
            <p>{totalEvents}</p>
          </div>
          {statusCounts.map((s) => (
            <div key={s._id} className="card">
              <h3>{s._id} Events</h3>
              <p>{s.count}</p>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          {/* Department Chart */}
          <div className="chart-box">
            <h3>Department-wise Events</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentCounts}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Chart */}
          <div className="chart-box">
            <h3>Monthly Event Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyCounts.map((m) => ({
                  name: monthNames[m._id],
                  count: m.count,
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Paid vs Free Pie */}
          <div className="chart-box">
            <h3>Paid vs Free Events</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paidStats.map((p) => ({
                    name: p._id ? "Paid" : "Free",
                    value: p.count,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {paidStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default AnalysisDashboard;
