import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookPlus,
  BookOpen,
  BarChart2,
  UserCheck,
  Settings,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

// ======================================================================
// Main Instructor Sidebar Component
// ======================================================================
const Sidebar = () => {
  const { updateRole } = useAuthStore();

  const handleUpdateRole = () => {
    const role = "student";
    updateRole(role);
  };

  // Common Tailwind classes for the navigation links
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-4 p-4 rounded-xl transition-colors duration-200 ` +
    (isActive
      ? "bg-gray-700 text-white font-bold"
      : "text-gray-400 hover:bg-gray-800 hover:text-white");

  return (
    <div className="relative w-1/5">
      <div className="flex flex-col fixed top-0 h-screen bg-gray-900 text-white w-1/5 p-6 shadow-xl">
        {/* Sidebar Header */}
        <div className="flex items-center mb-10">
          <h2 className="text-2xl font-extrabold text-green-500">
            Learn <span className="text-white">Sphere</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          <NavLink to="dashboard" className={linkClasses}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="course-creation" className={linkClasses}>
            <BookPlus size={20} />
            <span>Course Creation</span>
          </NavLink>
          <NavLink to="my-courses" className={linkClasses}>
            <BookOpen size={20} />
            <span>My Courses</span>
          </NavLink>
          <NavLink to="analytics" className={linkClasses}>
            <BarChart2 size={20} />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="profile" className={linkClasses}>
            <UserCheck size={20} />
            <span>Profile</span>
          </NavLink>
        </nav>

        {/* Spacer for bottom items */}
        <div className="flex-1"></div>

        {/* Footer link or user info */}
        <div className="border-t border-gray-700 pt-6">
          <button
            onClick={handleUpdateRole}
            className="bg-green-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-600 transition-colors duration-200 shadow-md"
          >
            Student Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
