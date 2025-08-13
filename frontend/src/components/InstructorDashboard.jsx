import React from "react";
import { useNavigate } from "react-router-dom";
import CourseList from "./CourseList";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="bg-white shadow-md rounded-lg p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600">Role: {user.role}</p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          onClick={() => navigate("/course-creation")}
        >
          Create Course
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm uppercase">Total Courses</h2>
          <p className="text-3xl font-bold text-blue-500">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm uppercase">Total Students</h2>
          <p className="text-3xl font-bold text-green-500">124</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm uppercase">Earnings</h2>
          <p className="text-3xl font-bold text-yellow-500">$1,450</p>
        </div>
      </section>

      {/* Courses List */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Your Courses</h2>
        <CourseList />
      </section>
    </div>
  );
};

export default InstructorDashboard;
