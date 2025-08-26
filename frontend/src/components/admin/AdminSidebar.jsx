import React from "react";
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookCheck,
  BarChart2,
  Settings,
  LogOut,
  BarChart,
  User,
  Home,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
// Assuming useAuthStore exists for handling authentication and roles
// import { useAuthStore } from "../../store/useAuthStore";

// ======================================================================
// Admin Sidebar Component
// ======================================================================
const AdminSidebar = () => {
  // const { updateRole } = useAuthStore();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // Handle logout functionality
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Admin logged out");
    logout();
    navigate("/"); // Navigate to home or login page
  };

  // Common Tailwind classes for the navigation links
  // This uses a different styling approach than the instructor sidebar for a unique look
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-4 px-6 py-3 rounded-lg transition-all duration-300 relative ` +
    (isActive
      ? "bg-indigo-600 text-white font-semibold transform scale-105 shadow-lg"
      : "text-gray-300 hover:bg-gray-700 hover:text-white");

  return (
    <div className="relative w-1/5 min-w-[250px]">
      <div className="fixed top-0 left-0 h-screen bg-gray-900 text-white w-1/5 min-w-[250px] p-6 shadow-2xl flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center mb-12 border-b border-gray-700 pb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mr-4">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold">
            <span className="text-indigo-500">Admin</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-3">
          <NavLink to="dashboard" className={linkClasses}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="manage-users" className={linkClasses}>
            <Users size={20} />
            <span>Manage Users</span>
          </NavLink>
          <NavLink to="manage-courses" className={linkClasses}>
            <BookCheck size={20} />
            <span>Manage Courses</span>
          </NavLink>
          <NavLink to="site-analytics" className={linkClasses}>
            <BarChart2 size={20} />
            <span>Site Analytics</span>
          </NavLink>
          <NavLink to="/" className={linkClasses}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="settings" className={linkClasses}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Spacer for bottom items */}
        <div className="flex-1"></div>

        {/* Footer link or user info */}
        <div className="border-t border-gray-700 pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
