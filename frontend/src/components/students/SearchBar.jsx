// ======================================================================
// SearchBar.jsx - A component for searching with a dropdown result list

import { useState } from "react";
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";

// ======================================================================
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Mock data for search results
  const mockCourses = [
    { _id: 1, title: "Introduction to Web Design", instructor: "Jane Doe" },
    { _id: 2, title: "Advanced JavaScript Concepts", instructor: "John Smith" },
    { _id: 3, title: "Creative Photography Basics", instructor: "Emily White" },
    { _id: 4, title: "Digital Marketing 101", instructor: "Michael Brown" },
    {
      _id: 5,
      title: "Figma UI/UX Design Fundamentals",
      instructor: "Sarah Lee",
    },
  ];

  useEffect(() => {
    if (searchTerm.length > 2) {
      const results = mockCourses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-12">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for courses..."
          className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-900 border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((course) => (
            <div
              key={course.id}
              className="p-4 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            >
              <p className="text-white font-medium">{course.title}</p>
              <p className="text-sm text-gray-400">{course.instructor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
