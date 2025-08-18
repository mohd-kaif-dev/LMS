import React, { useState } from "react";
import {
  Search,
  BookOpen,
  CheckCircle,
  XCircle,
  Trash2,
  MoreVertical,
  Edit,
  User,
  Plus,
  Rocket,
  Clock,
  ExternalLink,
} from "lucide-react";

// ======================================================================
// CourseActionsDropdown Component - Reusable component for course actions
// ======================================================================
const CourseActionsDropdown = ({ onApprove, onReject, onDelete, onView }) => {
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
              onView();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
          >
            <ExternalLink size={16} />
            <span>View Details</span>
          </button>
          <button
            onClick={() => {
              onApprove();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-green-400 hover:bg-gray-600 w-full text-left"
          >
            <CheckCircle size={16} />
            <span>Approve Course</span>
          </button>
          <button
            onClick={() => {
              onReject();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-yellow-400 hover:bg-gray-600 w-full text-left"
          >
            <XCircle size={16} />
            <span>Reject Course</span>
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
          >
            <Trash2 size={16} />
            <span>Delete Course</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ======================================================================
// ManageCourses Component - The main component for managing courses
// ======================================================================
const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Web Design",
      author: "Jane Doe",
      status: "Published",
      createdDate: "2023-01-15",
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      author: "John Smith",
      status: "Pending",
      createdDate: "2023-03-22",
    },
    {
      id: 3,
      title: "Creative Photography Basics",
      author: "Emily White",
      status: "Draft",
      createdDate: "2023-05-10",
    },
    {
      id: 4,
      title: "Digital Marketing 101",
      author: "Michael Brown",
      status: "Published",
      createdDate: "2023-02-28",
    },
    {
      id: 5,
      title: "Figma UI/UX Design",
      author: "Sarah Lee",
      status: "Pending",
      createdDate: "2023-06-18",
    },
    {
      id: 6,
      title: "Motion Graphics with AE",
      author: "Mark Johnson",
      status: "Draft",
      createdDate: "2023-07-01",
    },
  ]);

  const handleApprove = (id) => {
    console.log(`Approving course with ID: ${id}`);
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, status: "Published" } : course
      )
    );
    // Implement API call to approve the course
  };

  const handleReject = (id) => {
    console.log(`Rejecting course with ID: ${id}`);
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, status: "Rejected" } : course
      )
    );
    // Implement API call to reject the course
  };

  const handleDelete = (id) => {
    console.log(`Deleting course with ID: ${id}`);
    setCourses(courses.filter((course) => course.id !== id));
    // Implement API call to delete the course
  };

  const handleView = (id) => {
    console.log(`Viewing details for course with ID: ${id}`);
    // Navigate to a course detail page
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header and Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold">Manage Courses</h1>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-600 transition-colors duration-200">
            <Plus size={20} />
            <span>Add New Course</span>
          </button>
        </div>
        <p className="text-lg text-gray-400 mb-12">
          View, approve, and manage all courses on the platform.
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
              placeholder="Search courses by title or author..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Course Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-sm font-semibold text-gray-400">
                  <th scope="col" className="py-3 px-4">
                    Title
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Author
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Created Date
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="py-4 px-4 flex items-center space-x-2">
                      <BookOpen size={20} />
                      <span>{course.title}</span>
                    </td>
                    <td className="py-4 px-4">{course.author}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.status === "Published"
                            ? "bg-green-500 text-black"
                            : course.status === "Pending"
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">{course.createdDate}</td>
                    <td className="py-4 px-4 text-right">
                      <CourseActionsDropdown
                        onApprove={() => handleApprove(course.id)}
                        onReject={() => handleReject(course.id)}
                        onDelete={() => handleDelete(course.id)}
                        onView={() => handleView(course.id)}
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

export default CourseManagement;
