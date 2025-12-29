

import DepartmentNavbar from "../components/DepartmentNavbar";
import { Outlet } from "react-router-dom";

const DepartmentLayout = () => {
  return (
    <>
      <DepartmentNavbar />
      <Outlet />
    </>
  );
};

export default DepartmentLayout;
