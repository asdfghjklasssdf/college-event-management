import { Navigate } from "react-router-dom";

const AdminAccessRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  // not logged in → send to ADMIN LOGIN
  if (!user) return <Navigate to="/Adminlogin" replace />;

  // block students
  if (user.role === "Student") return <Navigate to="/dashboard" replace />;

  // allow Admin + Coordinator
  return children;
};

export default AdminAccessRoute;
