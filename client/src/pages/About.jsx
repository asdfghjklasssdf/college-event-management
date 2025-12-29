import React from "react";
import "./About.css";

 import Navbar from "./Navbar"; // ✅ Import Navbar
const About = () => {
  return (
    
    <div className="about-page">

      <div className="about-hero">
        <h1>🎓 About EventHub</h1>
        <p>Connecting Colleges. Empowering Events. Inspiring Students.</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            EventHub is designed to simplify college event management for both
            students and administrators. Our mission is to provide a seamless,
            transparent, and efficient platform to organize, promote, and manage
            campus activities — from workshops to cultural fests.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li>✅ Easy event creation and registration</li>
            <li>✅ Centralized dashboard for all college activities</li>
            <li>✅ QR-based attendance & digital posters</li>
            <li>✅ Calendar view for better event tracking</li>
            <li>✅ Secure login for students, coordinators, and admins</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Vision</h2>
          <p>
            To build a digital ecosystem that makes college events more
            engaging, transparent, and accessible — bringing every student closer
            to the opportunities they deserve.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
