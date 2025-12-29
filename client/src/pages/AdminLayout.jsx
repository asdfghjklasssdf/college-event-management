import AdminNavbar from "./Navbaradmin";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <AdminNavbar />
      <Outlet />
    </div>
  );
}
