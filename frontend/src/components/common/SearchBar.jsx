import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import useCourseStore from "../../store/useCourseStore";
import { Search } from "lucide-react";

const SearchBar = ({
  isSearchDropdownOpen,
  setIsSearchDropdownOpen,
  searchDropdownRef,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const { courses, instructors, isFetching, fetchCourses } = useCourseStore();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearchDropdownOpen(value.trim().length > 0);
  };

  //   const closeSearchDropdown = () => {
  //     setTimeout(() => {
  //       setIsSearchDropdownOpen(false);
  //     }, 150);
  //   };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // wait 500ms after user stops typing

    return () => {
      clearTimeout(handler); // cleanup on each keystroke
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm.trim().length > 0) {
      console.log("Serach:", debouncedTerm);
      fetchCourses({ debouncedTerm });
    }
  }, [debouncedTerm, fetchCourses]);

  return (
    <div className="flex-grow mx-4 max-w-lg hidden md:block">
      <div className="relative" ref={searchDropdownRef}>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          //   onBlur={closeSearchDropdown}
          placeholder="Search courses or instructors..."
          className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isSearchDropdownOpen && (
          <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-lg shadow-xl z-10 p-4 max-h-96 overflow-y-auto">
            {/* Header */}
            <h3 className="text-sm text-gray-600 mb-3">
              Results for <span className="font-semibold">"{searchTerm}"</span>
            </h3>

            {/* Loading */}
            {isFetching && (
              <p className="text-gray-500 text-sm">Searching...</p>
            )}

            {/* No results */}
            {!isFetching &&
              courses.length === 0 &&
              instructors?.length === 0 && (
                <p className="text-gray-500 text-sm">No results found.</p>
              )}

            {/* Courses */}
            {courses.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Courses
                </h4>
                <ul>
                  {courses.map((course) => (
                    <li key={course._id}>
                      <NavLink
                        to={`/course/${course._id}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition"
                      >
                        <img
                          src={course.thumbnail || "https://placehold.co/80x50"}
                          alt={course.title}
                          className="w-16 h-10 rounded-md object-cover"
                        />
                        <span className="text-sm text-gray-800 line-clamp-1">
                          {course.title}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructors */}
            {instructors && instructors?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Instructors
                </h4>
                <ul>
                  {instructors.map((teacher) => (
                    <li key={teacher._id}>
                      <NavLink
                        to={`/instructors/${teacher._id}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition"
                      >
                        <img
                          src={teacher.avatar || "https://placehold.co/40x40"}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-800 line-clamp-1">
                          {teacher.name}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
