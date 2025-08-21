import {
  BookOpen,
  DraftingCompass,
  Plus,
  Rocket,
  BookMarked,
} from "lucide-react";

import useCourseStore from "../../store/useCourseStore";
import { useEffect } from "react";
import CourseCard from "./CourseCard";
// ======================================================================
// StatCard Component - For displaying key metrics
// ======================================================================
const StatCard = ({ icon, title, value, color }) => {
  return (
    <div
      className={`flex items-center space-x-4 p-6 rounded-2xl shadow-lg ${color} text-white`}
    >
      <span className="p-3 rounded-full bg-white bg-opacity-20">{icon}</span>
      <div>
        <h3 className="text-xl font-semibold">{value}</h3>
        <p className="text-sm opacity-80">{title}</p>
      </div>
    </div>
  );
};

// ======================================================================
// MyCourses Component - The main component for displaying courses
// ======================================================================
const MyCourses = () => {
  const { courses, fetchInstructorsCourses } = useCourseStore();

  const publishedCourses = courses.filter(
    (course) => course.status === "published"
  );
  const draftCourses = courses.filter((course) => course.status === "draft");

  useEffect(() => {
    fetchInstructorsCourses();
  }, [fetchInstructorsCourses]);

  console.log("Courses", courses);
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">My Courses</h1>
        <p className="text-lg text-gray-400 mb-12">
          Manage your published and draft courses.
        </p>

        {/* Course Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<BookOpen size={24} />}
            title="Published"
            value={publishedCourses.length}
            color="bg-green-600"
          />
          <StatCard
            icon={<DraftingCompass size={24} />}
            title="Drafts"
            value={draftCourses.length}
            color="bg-red-600"
          />
          <StatCard
            icon={<BookMarked size={24} />}
            title="Total Courses"
            value={courses.length}
            color="bg-blue-600"
          />
        </div>

        {/* Published Courses Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Published Courses</h2>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-600 transition-colors duration-200">
              <Plus size={20} />
              <span>Create New Course</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>

        {/* Draft Courses Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Draft Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
