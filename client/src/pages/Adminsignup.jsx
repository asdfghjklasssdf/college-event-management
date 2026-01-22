import React, { useState, useEffect } from "react"; // 🟩 added useEffect
import axios from "axios";
import "./Signup.css";

const Adminsignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    collegeId: "",
    department: "",
    year: "",
    role: "",
    profilePhoto: null,
  });
// 🟩 NEW: department state
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const navbars = document.querySelectorAll("nav");
    navbars.forEach(nav => (nav.style.display = "none"));

    return () => {
      navbars.forEach(nav => (nav.style.display = "block"));
    };
  }, []);
  // 🟩 Fetch department list from backend when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to fetch departments", err));
  }, []);
  const handleChange = (e) => {
    if (e.target.name === "profilePhoto") {
      setFormData({ ...formData, profilePhoto: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
     <div className="signup-container">
      {/* LEFT SIDE - IMAGE / INFO */}
      <div className="signup-left">
        <h1>Join EventHub 🎓</h1>
        <p>
          Create and manage college events with ease.  
          Sign up to start organizing and exploring campus activities today!
        </p>
        
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="signup-right">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Sign Up</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="mobileNumber"
            placeholder="Mobile Number"
            onChange={handleChange}
          />
          <input
            type="text"
            name="collegeId"
            placeholder="College ID"
            onChange={handleChange}
            required
          />

         <select name="department" onChange={handleChange} required>
  <option value="">Select Department</option>
  {departments.map((dept) => (
    <option key={dept._id} value={dept.name}>
      {dept.name}
    </option>
  ))}
</select>

          <select name="year" onChange={handleChange} required>
            <option value="">Select Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
          </select>

          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Coordinator">Coordinator</option>
            <option value="Admin">Admin</option>
          </select>

          <input
            type="file"
            name="profilePhoto"
            onChange={handleChange}
          />

          <button type="submit">Register</button>

          <p>
            Already have an account?{" "}
            <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Adminsignup;