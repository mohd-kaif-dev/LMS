import React, { useState, useEffect } from "react";
import { Search, UserPlus, Trash2, User } from "lucide-react";
import { useAdminStore } from "../../store/useAdminStore";
import { dateFormat } from "../../utils/constant";

// ======================================================================
// ManageUsers Component - The main component for managing users
// ======================================================================
const UserManagement = () => {
  const { adminUsers: users, deleteUser, getAllUsers } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteUser = (id) => {
    deleteUser(id);
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const filteredUsers = users.filter((user) => {
    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return name.includes(searchTermLower) || email.includes(searchTermLower);
  });

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header and Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold">Manage Users</h1>
          {/* <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-600 transition-colors duration-200">
            <UserPlus size={20} />
            <span>Add User</span>
          </button> */}
        </div>
        <p className="text-lg text-gray-400 mb-12">
          View and manage all registered users on the platform.
        </p>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* User Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-sm font-semibold text-gray-400">
                  <th scope="col" className="py-3 px-4">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Role
                  </th>

                  <th scope="col" className="py-3 px-4">
                    Last Login
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="py-4 px-4 flex items-center space-x-2">
                      <User size={20} />
                      <span>{user.name}</span>
                    </td>
                    <td className="py-4 px-4">{user.email}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-indigo-500 text-white"
                            : user.role === "instructor"
                            ? "bg-teal-500 text-black"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-4">{dateFormat(user.createdAt)}</td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          handleDeleteUser(user._id);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
