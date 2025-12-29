import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
