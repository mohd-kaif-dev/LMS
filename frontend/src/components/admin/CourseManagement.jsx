import React, { useEffect, useState } from "react";
import {
  Search,
  BookOpen,
  Trash2,
  MoreVertical,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../store/useAdminStore";
import { dateFormat } from "../../utils/constant";

// ======================================================================
// CourseActionsDropdown Component - Reusable component for course actions
// ======================================================================
const CourseActionsDropdown = ({ onDelete, onView, isDeleting }) => {
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
              onDelete();
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
          >
            <Trash2 size={16} />
            <span>
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Delete Course"
              )}
            </span>
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
  const navigate = useNavigate();

  const {
    adminCourses: courses,
    isFetching,
    isDeleting,
    deleteCourse,
    getAllCourses,
    pagination: { page, limit, setPage, setLimit, total },
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleDelete = (id) => {
    deleteCourse(id);
  };

  const handleView = (id, title) => {
    console.log(`Viewing details for course with ID: ${id}`);
    // Navigate to a course detail page
    navigate(
      `/admin/courses/${title.replace(/\s+/g, "-").toLowerCase()}/view`,
      {
        state: {
          id: id,
        },
      }
    );
  };

  useEffect(() => {
    getAllCourses(page, limit, debouncedSearch);
  }, [getAllCourses, page, limit, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  console.log("Page React: ", page);

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header and Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold">Manage Courses</h1>
        </div>
        <p className="text-lg text-gray-400 mb-12">
          View and manage all courses on the platform.
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title or author..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Course Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
          {isFetching ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : (
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
                      key={course._id}
                      className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 flex items-center space-x-2">
                        <BookOpen size={20} />
                        <span>{course.title}</span>
                      </td>
                      <td className="py-4 px-4">{course?.instructor?.name}</td>
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
                      <td className="py-4 px-4">
                        {dateFormat(course.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <CourseActionsDropdown
                          onDelete={() => handleDelete(course._id)}
                          onView={() => handleView(course._id, course.title)}
                          isDeleting={isDeleting}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1); // reset page when limit changes
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                  </select>
                  <p className="text-sm font-semibold text-gray-400">
                    Showing {limit} courses per page
                  </p>
                </div>

                <div className="flex space-x-3 items-center">
                  <button
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={page === 1}
                  >
                    Prev
                  </button>

                  <span className="text-sm font-semibold text-gray-300">
                    Page {page} of {Math.ceil(total / limit)}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                    disabled={page === Math.ceil(total / limit)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
