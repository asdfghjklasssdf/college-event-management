import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  // ✅ read only from sessionStorage
  const token = sessionStorage.getItem("token");
  const expiry = sessionStorage.getItem("sessionExpiry");

  // 🔐 if token missing -> allow public page
  if (!token) return children;

  // ⏳ if expired -> clear and allow public page
  if (!expiry || Date.now() > Number(expiry)) {
    sessionStorage.clear();
    return children;
  }

  // 🚀 valid active session -> redirect to dashboard
  return <Navigate to="/dashboard" replace />;
}
