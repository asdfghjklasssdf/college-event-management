import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Dashboardadmin from "./pages/Dashboardadmin";

import About from "./pages/About";
import Contact from "./pages/Contact";

import EventForm from "./pages/EventForm";
import EventList from "./pages/EventList";
import EventRegister from "./pages/EventRegister";
import EventCalendar from "./pages/EventCalendar";

import AddVenue from "./pages/AddVenue";
import VenueBooking from "./pages/VenueBooking";
import VenueList from "./pages/VenueList";
import BookVenue from "./pages/BookVenue";

import AddDepartment from "./pages/AddDepartment";
import AnalysisDashboard from "./pages/AnalysisDashboard";
import RegistrationAnalytics from "./pages/RegistrationAnalytics";
import DeptParticipants from "./pages/DeptParticipants";            // NEW
import PublishResults from "./pages/PublishResults";                // NEW
import DeptNotifications from "./pages/DeptNotifications";          // NEW
import DeptProfile from "./pages/DeptProfile";                      // NEW
import DeptEditEvent from "./pages/DeptEditEvent";    
import DepartmentNavbar from "./pages/DepartmentNavbar";
import DepartmentAddEvent from "./pages/DepartmentAddEvent";
import DepartmentEventList from "./pages/DepartmentEventList";
import DepartmentDownloads from "./pages/DepartmentDownloads";
import Deptdashboard from "./pages/DeptDashboard";
import Navbar from "./pages/Navbar";                // student navbar
import Navbaradmin from "./pages/Navbaradmin";      // admin + coordinator navbar
import CoordinatorNavbar from "./pages/CoordinatorNavbar";
import Coordinatordashboard from "./pages/Coordinatordashboard";
import PublicRoute from "./pages/PublicRoute";
import AdminMore from "./pages/adminmore.jsx";
 // admin + coordinator navbar
import AdminAccessRoute from "./pages/AdminAccessRoute";
import DeptSelectEventParticipants from "./pages/DeptSelectEventParticipants";
import RoleSelection from "./pages/RoleSelection";
import StaticDashboard from "./pages/StaticDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import DeptSelectEventToEdit from "./pages/DeptSelectEventToEdit";
import Adminlogin from "./pages/Adminlogin.jsx";
import Adminsignup from "./pages/Adminsignup.jsx";
function App() {

const user = JSON.parse(sessionStorage.getItem("user"));

  // Hide navbar for department portal
  const isDepartmentPortal = window.location.pathname.startsWith("/dept");

  // Hide navbar for login + signup
  const noNavbarRoutes = ["/login", "/Signup","/App","/"];
  const hideNavbar = noNavbarRoutes.includes(window.location.pathname);

  return (
    <Router>
      {/* SHOW NAVBAR ONLY IF NOT IN DEPARTMENT PORTAL */}
    {/* SHOW NAVBAR */}
{!hideNavbar && (
  <>
    {isDepartmentPortal ? (
      <DepartmentNavbar />
    ) : (
      <>
        {user?.role === "Admin" && <Navbaradmin />}
        {user?.role === "Coordinator" && <CoordinatorNavbar />}
        {user?.role === "Student" && <Navbar />}
      </>
    )}
  </>
)}



      <Routes>
        <Route path="/static-dashboard" element={<StaticDashboard />} />
        <Route path="/" element={<RoleSelection />} />


        {/* AUTH
        <Route path="/login" element={<Login />} />*/}
         <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
  path="/Adminlogin"
  element={
    <PublicRoute>
      <Adminlogin />
    </PublicRoute>
  }
/>

        <Route 
        path="/signup" 
        element={            
            <Signup />            
          } />
   <Route
  path="/Adminsignup"
  element={
     <AdminAccessRoute allowedRoles={["Admin"]} redirectTo="/Adminlogin">
      <Adminsignup />
     </AdminAccessRoute>
  }
/>


        <Route
          path="/dashboard"
          element={
            <AdminAccessRoute allowedRoles={["Student", "Coordinator", "Admin"]}>
              <Dashboard />
            </AdminAccessRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/Dashboardadmin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Dashboardadmin />
            </ProtectedRoute>
          }
        /><Route path="/admin-more" element={<AdminMore />} />

        {/* COMMON PAGES */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* EVENTS */}
        <Route
          path="/add-event"
          element={
            <ProtectedRoute allowedRoles={["Coordinator", "Admin"]}>
              <EventForm />
            </ProtectedRoute>
          }
        />

        <Route path="/listevent" element={<EventList />} />
        <Route path="/events/:id/register" element={<EventRegister />} />
        <Route path="/calendar" element={<EventCalendar />} />

        {/* VENUES */}
        <Route
          path="/add-venue"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddVenue />
            </ProtectedRoute>
          }
        />
        <Route path="/venues" element={<VenueBooking />} />
        <Route path="/listvenue" element={<VenueList />} />
        <Route path="/book-venue/:id" element={<BookVenue />} />

        {/* ADMIN ANALYTICS */}
        <Route
          path="/analysis"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AnalysisDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <RegistrationAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-department"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddDepartment />
            </ProtectedRoute>
          }
        />

        {/* ===== DEPARTMENT PORTAL ===== */}
<Route
  path="/deptdashboard"
  element={
    <ProtectedRoute allowedRoles={["Coordinator", "Admin"]}>
      <Deptdashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/deptadd-event" element={<DepartmentAddEvent />} />
        <Route path="/deptlist-event" element={<DepartmentEventList />} />
        <Route path="/deptdownloads" element={<DepartmentDownloads />} />
        <Route path="/deptbook-venue" element={<VenueBooking />} />

        <Route path="/dept/participants/:eventId" element={<DeptParticipants />} />
        <Route path="/dept/publish-results/:eventId" element={<PublishResults />} />
        <Route path="/dept/notifications" element={<DeptNotifications />} />
        <Route path="/dept/profile" element={<DeptProfile />} />
     <Route
  path="/dept/participants/select"
  element={<DeptSelectEventParticipants />}
/>

<Route
  path="/dept/edit-event/select"
  element={<DeptSelectEventToEdit />}
/>

<Route path="/dept/edit-event/:id" element={<DeptEditEvent />} />
        <Route path="/deptCoordinatordashboard" element={<Coordinatordashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
