import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CourseCard from "../components/user/CourseCard";
import useCourseStore from "../store/useCourseStore";
import { Search } from "lucide-react";

const CategoryDisplay = () => {
  const { courses, isFetching, fetchCourses } = useCourseStore();
  const [query, setQuery] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const category = useParams().category;

  const Capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(query);
    }, 500); // wait 500ms after user stops typing

    return () => {
      clearTimeout(handler); // cleanup on each keystroke
    };
  }, [query]);

  useEffect(() => {
    fetchCourses({ category, searchTerm: debouncedTerm, limit: 10 });
  }, [fetchCourses, category, debouncedTerm]);

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {Capitalize(category).replace("-", " ")} Courses
          </h1>
          <p className="text-lg text-gray-400">
            Explore a wide range of courses to build your{" "}
            {category.replace("-", " ")} skills.
          </p>
        </div>

        <div className="flex items-center mb-8">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full px-4 py-2 pl-10 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={handleSearch}
            />
            <span className="absolute top-0 left-0 inline-flex items-center justify-center w-10 h-full text-gray-400 hover:text-gray-500">
              <Search size={20} />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div key={course._id}>
              {!isFetching ? (
                <CourseCard course={course} />
              ) : (
                <div
                  key={course._id}
                  className="w-full h-64 bg-gray-700 animate-pulse rounded-lg"
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDisplay;
