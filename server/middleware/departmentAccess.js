// middleware/departmentAccess.js
export const allowDepartment = () => {
  return (req, res, next) => {
    if (req.user.role === "Admin") {
      return next(); // Admin sees everything
    }

    // Coordinator or Student -> restrict to own department
    req.departmentFilter = { department: req.user.department };
    next();
  };
};
