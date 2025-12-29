import DepartmentNavbar from "./DepartmentNavbar";
import { Outlet } from "react-router-dom";

export default function CoordinatorLayout() {
  return (
    <div>
      <DepartmentNavbar />
      <Outlet />
    </div>
  );
}
