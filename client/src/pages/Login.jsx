import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // ✅ import this file
//import marwadiLogo from "../assets/marwadi.png";
//import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", formData);

    alert(res.data.message);

    const user = res.data.user;

     sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // ⏳ optional auto-expiry (e.g., 40 mins)
      const expiryTime = Date.now() + 40 * 60 * 1000;
      sessionStorage.setItem("sessionExpiry", expiryTime);

    console.log("Redirecting to:", user.role);

    // Redirect based on role
      if (user.role === "Admin") {
        window.location.href = "/Dashboardadmin";
      } else if (user.role === "Student") {
        window.location.href = "/dashboard";
      } else if (user.role === "Coordinator") {
        window.location.href = "/deptCoordinatordashboard";
      } else {
        window.location.href = "/dashboard";
      }

    navigate("/dashboard", { replace: true });

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="login-container">
      {/* LEFT SIDE */}
    <div className="login-left">
        {/* ✅ Add Marwadi University Logo */}
          <img
  src="/assets/marwadi.png"
  alt="Marwadi University Logo"
  className="university-logo"
/>
        <h1>Welcome to <br /> <span>Marwadi University</span> 🎓</h1>
        <p>
          Streamline event creation, registration, and management for your college.
          Join EventHub to explore and manage your campus events effortlessly!
        </p>
      </div>
    

      {/* RIGHT SIDE */}
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>


{/* OPTION 1 */}
<p>
  <a href="/login">Go to Login</a>
</p>

<p>
  <a href="/Signup">Go to Signup</a>
</p>
{/* OPTION 2 (Role-based Dashboard)Dashboardadmin */}
<p>
  <a
    href="/login"
    onClick={(e) => {
      e.preventDefault();
      const user = JSON.parse(sessionStorage.getItem("user"));

      if (!user) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }

      if (user.role === "Student") window.location.href = "/dashboard";
      else if (user.role === "Coordinator") window.location.href = "/deptCoordinatordashboard";
      else if (user.role === "Admin") window.location.href = "/Dashboardadmin";
    }}
  >
    Go to Dashboard
  </a>
</p>




        </form>
      </div>
    </div>
  );
};

export default Login;
