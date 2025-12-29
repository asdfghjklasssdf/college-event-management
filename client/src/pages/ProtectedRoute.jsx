import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // ✅ get auth from sessionStorage only
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const expiry = sessionStorage.getItem("sessionExpiry");

  // 🔒 no token or user → force login
  if (!token || !user) {
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // ⏳ session expired → logout & go to login
  if (!expiry || Date.now() > Number(expiry)) {
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 🛑 role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ otherwise allow
  return children;
};

export default ProtectedRoute;
/*import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;*/
