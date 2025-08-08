import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        {user ? (
          <>
            {/* User Info */}
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {user.name || user.email}
              </h2>
              <p className="text-gray-600">Email: {user.email}</p>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full mx-auto mt-4"
                />
              )}
              <p className="text-gray-500 mt-2">Role: {user?.role || "NA"}</p>
              <button
                onClick={handleLogout}
                className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
              >
                Logout
              </button>
            </div>

            {/* Dummy Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600">Courses Enrolled</p>
                <p className="text-2xl font-bold text-blue-800">8</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600">Completed Lessons</p>
                <p className="text-2xl font-bold text-green-800">45</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center">
                <p className="text-sm text-yellow-600">Certificates Earned</p>
                <p className="text-2xl font-bold text-yellow-800">3</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Recent Activity
              </h3>
              <ul className="space-y-2">
                <li className="p-3 bg-gray-50 rounded-lg shadow-sm">
                  ✅ Completed "React Basics" lesson
                </li>
                <li className="p-3 bg-gray-50 rounded-lg shadow-sm">
                  📚 Enrolled in "Advanced Node.js"
                </li>
                <li className="p-3 bg-gray-50 rounded-lg shadow-sm">
                  🏆 Earned certificate for "JavaScript Mastery"
                </li>
              </ul>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Home Page</p>
        )}
      </div>
    </div>
  );
};

export default Home;
