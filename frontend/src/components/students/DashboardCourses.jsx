// ======================================================================
// FeaturedCourses.jsx - A section for featured courses
// ======================================================================

import { useEffect } from "react";
import useCourseStore from "../../store/useCourseStore";
import CourseCard from "../user/CourseCard";

const DashboardCourses = ({ title, slug }) => {
  const { courses, fetchCourses, isFetching } = useCourseStore();

  useEffect(() => {
    fetchCourses({ category: slug });
  }, [fetchCourses, slug]);

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 michroma-regular">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {!isFetching
          ? courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          : [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-[300px] rounded-lg bg-gray-300 animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default DashboardCourses;
