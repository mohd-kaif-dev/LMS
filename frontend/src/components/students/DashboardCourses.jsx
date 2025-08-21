import { useEffect, useState } from "react";
import useCourseStore from "../../store/useCourseStore";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const CourseCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-xl overflow-hidden animate-pulse">
    <div className="w-full h-40 bg-slate-700"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
      <div className="h-3 bg-slate-700 rounded w-1/2"></div>
      <div className="h-3 bg-slate-700 rounded w-1/4"></div>
    </div>
  </div>
);

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/courses/${course._id}`)}
      className="group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/30 cursor-pointer"
    >
      <img
        src={course.thumbnailUrl}
        alt={course.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-slate-100 truncate">{course.title}</h3>
        <p className="text-sm text-slate-400 mb-3">
          by {course.instructor.name}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-blue-400">
            ₹{course.price.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-bold">{course.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCourses = ({ title, slug }) => {
  const { fetchCourses, isFetching } = useCourseStore();
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      const data = await fetchCourses({ category: slug, limit: 4 });
      setCourses(data.courses);
    };
    loadCourses();
  }, [fetchCourses, slug]);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <button
          onClick={() => navigate(`/category/${slug}`)}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-700/50 transition-colors"
        >
          View All
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isFetching
          ? Array.from({ length: 4 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))
          : courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
      </div>
    </div>
  );
};

export default DashboardCourses;
