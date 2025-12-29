import React, { useState } from "react";
import DepartmentNavbar from "./DepartmentNavbar";
import EventForm from "./EventForm";

const DepartmentAddEvent = () => {
  return (
    <div>
      <EventForm departmentPanel={true} />
    </div>
  );
};

export default DepartmentAddEvent;
