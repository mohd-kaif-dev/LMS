import React, { useState } from "react";
import {
  Search,
  UserCheck,
  UserX,
  UserPlus,
  Trash2,
  MoreVertical,
  Edit,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ======================================================================
// DropdownMenu Component - Reusable component for user actions
// ======================================================================
const DropdownMenu = ({ onEdit, onDelete, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white transition-colors duration-200"
      >
        <MoreVertical size={20} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
          >
            <Edit size={16} />
            <span>Edit User</span>
          </button>
          <button
            onClick={() => {
              onRoleChange();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
          >
            <UserCheck size={16} />
            <span>Change Role</span>
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
          >
            <Trash2 size={16} />
            <span>Delete User</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ======================================================================
// ManageUsers Component - The main component for managing users
// ======================================================================
const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "student",
      status: "active",
      lastLogin: "2 days ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "instructor",
      status: "active",
      lastLogin: "1 hour ago",
    },
    {
      id: 3,
      name: "Peter Jones",
      email: "peter.jones@example.com",
      role: "student",
      status: "banned",
      lastLogin: "1 month ago",
    },
    {
      id: 4,
      name: "Emily White",
      email: "emily.white@example.com",
      role: "admin",
      status: "active",
      lastLogin: "5 mins ago",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "student",
      status: "active",
      lastLogin: "1 week ago",
    },
  ]);

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    console.log(`Deleting user with ID: ${id}`);
    // Here you would typically make an API call to delete the user
  };

  const handleEditUser = (id) => {
    console.log(`Editing user with ID: ${id}`);
    // Open a modal or navigate to an edit page
  };

  const handleRoleChange = (id) => {
    console.log(`Changing role for user with ID: ${id}`);
    // Open a modal to select new role
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header and Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold">Manage Users</h1>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-600 transition-colors duration-200">
            <UserPlus size={20} />
            <span>Add User</span>
          </button>
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
                    Status
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
                {users.map((user) => (
                  <tr
                    key={user.id}
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
                    <td className="py-4 px-4">
                      <span
                        className={`flex items-center space-x-1 font-semibold text-xs`}
                      >
                        {user.status === "active" ? (
                          <>
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-green-500">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="text-red-500" />
                            <span className="text-red-500">Banned</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4">{user.lastLogin}</td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu
                        onEdit={() => handleEditUser(user.id)}
                        onDelete={() => handleDeleteUser(user.id)}
                        onRoleChange={() => handleRoleChange(user.id)}
                      />
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
