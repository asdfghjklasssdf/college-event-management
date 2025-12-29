import React, { useState } from "react";
import "./Contact.css";
import Navbar from "./Navbar"; 
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can connect this to backend later (e.g., /api/contact)
    console.log("Contact Form:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>📞 Contact Us</h1>
        <p>We’d love to hear from you! Reach out for any queries or feedback.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>
            <b>Email:</b> support@eventhubcollege.com
          </p>
          <p>
            <b>Phone:</b> +91 98765 43210
          </p>
          <p>
            <b>Address:</b> EventHub HQ, Tech Park, Your City, India
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Send a Message</h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Send Message</button>

          {submitted && (
            <p className="success-msg">
              ✅ Thank you! Your message has been sent.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
