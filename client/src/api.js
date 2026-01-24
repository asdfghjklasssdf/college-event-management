import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://event-management-app-v76l.onrender.com"
      : "http://localhost:5000",
});

export default api;
