import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";

const DeptProfile = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  // safety: if session missing, redirect to login
  if (!user) {
    window.location.href = "/login";
  }
 
  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    department: user.department,
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [imagePreview, setImagePreview] = useState(user.profilePhoto || "");
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("mobileNumber", form.mobileNumber);

    if (imageFile) {
      formData.append("profilePhoto", imageFile);
    }

    const res = await axios.patch("/api/users/update", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Profile Updated!");
    sessionStorage.setItem("user", JSON.stringify(res.data.user));
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const token = sessionStorage.getItem("token");

    await axios.patch(
      "/api/users/change-password",
      passwords,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Password Updated Successfully!");
    setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
        <div className="download">

    <div className="profile-wrapper ">

      {/* PROFILE PREVIEW CARD */}
      <div className="profile-card">
        <img
          src={imagePreview || "/default-profile.png"}
          alt="Profile"
          className="profile-photo"
        />
        <h2>{form.fullName}</h2>
        <p>{form.email}</p>
        <p><b>Department:</b> {form.department}</p>

        <label className="upload-btn">
          Upload New Photo
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      {/* PROFILE EDIT FORM */}
      <div className="profile-container">
        <h1>Edit Profile Details</h1>

        <form onSubmit={updateProfile}>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <input
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
          />

          <input
            name="department"
            value={form.department}
            disabled
          />

          <button type="submit">Save Changes</button>
        </form>

        {/* CHANGE PASSWORD SECTION */}
        <h2 style={{ marginTop: "30px" }}>Change Password</h2>

        <form onSubmit={updatePassword} className="password-form">
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Current Password"
          />

          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
          />

          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm New Password"
          />

          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
        </div>

  );
};

export default DeptProfile;
