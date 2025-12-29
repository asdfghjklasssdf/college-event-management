import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddDepartment.css";
 import Navbar from "./Navbar";
const AddDepartment = () => {
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);

  // Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!department.trim()) return alert("Please enter a department name");

    try {
      const res = await axios.post("http://localhost:5000/api/departments/add", { name: department });
      alert(res.data.message);
      setDepartment("");
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add department");
    }
  };

  return (
      <div className="backgroundcontainer">
    <div className="dept-container">
      <h2>Add Department</h2>
      <form onSubmit={handleAdd} className="dept-form">
        <input
          type="text"
          placeholder="Enter Department Name"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <button type="submit">Add Department</button>
      </form>

      <h3>Existing Departments</h3>
      <ul>
        {departments.map((dept) => (
          <li key={dept._id}>{dept.name}</li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default AddDepartment;
