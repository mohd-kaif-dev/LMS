import React, { useEffect } from "react";
import { BookOpen, Star, TrendingUp, CheckCircle } from "lucide-react";
import useCourseStore from "../../store/useCourseStore";

// ======================================================================
// CourseCard Component - A reusable card for displaying an enrolled course
// ======================================================================
// EnrolledCourseCard.jsx

import { Clock, Layers, BarChart3, PlayCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Helper component for the circular progress bar
const CircularProgress = ({ progress, size = 60, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-slate-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-cyan-500 transition-all duration-500 ease-in-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-sm font-semibold text-slate-200">
        {`${progress}%`}
      </span>
    </div>
  );
};

// Helper function to format seconds into a readable string (e.g., "3h 30m")
const formatDuration = (totalSeconds) => {
  if (totalSeconds < 60) return "Less than a minute";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  let result = "";
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim();
};

const EnrolledCourseCard = ({ course }) => {
  // Calculate total lessons from the course data
  const navigate = useNavigate();

  const totalLessons = course.sections.reduce(
    (acc, section) => acc + (section.lessons?.length || 0),
    0
  );

  // Format the total duration
  const courseDuration = formatDuration(course.totalDuration);

  return (
    <div
      onClick={() =>
        navigate(
          `/courses/${course.title.replace(/\s+/g, "-").toLowerCase()}/learn/${
            course.sections[0].lessons[0]._id
          }`,
          {
            state: {
              id: course._id,
            },
          }
        )
      }
      className="group bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-lg 
                   transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1"
    >
      {/* --- Image and Category Badge --- */}
      <div className="relative">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {/* Overlay with play button on hover */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircle size={64} className="text-white/80" />
        </div>
        <span className="absolute top-4 right-4 bg-cyan-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
          {course.category}
        </span>
      </div>

      {/* --- Course Content --- */}
      <div className="p-5">
        <h3
          className="text-xl font-bold text-slate-100 mb-1 truncate"
          title={course.title}
        >
          {course.title}
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          by {course?.instructor?.name}
        </p>

        {/* --- Informative Badges --- */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-300 mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-cyan-500" />
            <span className="capitalize">{course.dificulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-cyan-500" />
            <span>{totalLessons} Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-cyan-500" />
            <span>{courseDuration}</span>
          </div>
        </div>

        {/* --- Progress Section --- */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-400 text-sm">Progress</span>
            <span className="text-slate-100 font-semibold">
              {course.progress === 100 ? "Completed!" : "Keep going!"}
            </span>
          </div>
          <CircularProgress progress={course.progress} />
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// MyEnrollement Component - The main page for enrolled students
// ======================================================================
const MyEnrollement = () => {
  const { courses, fetchStudentEnrolledCourses, isFetching } = useCourseStore();

  useEffect(() => {
    fetchStudentEnrolledCourses();
  }, [fetchStudentEnrolledCourses]);

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2">My Courses</h1>
        <p className="text-lg text-gray-400 mb-12">
          Your enrolled courses and progress.
        </p>

        {/* Enrolled Courses Grid */}
        {!isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <EnrolledCourseCard key={course?._id} course={course} />
              ))
            ) : (
              <div
                className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-lg 
                   transition-all duration-300 hover:shadow-cyan-500/20 p-6 text-center col-span-3"
              >
                <BookOpen size={64} className="text-cyan-500 mx-auto" />
                <h3 className="mt-2 text-lg font-semibold">
                  Your courses, made with love.
                </h3>
                <p className="mt-2 text-gray-400">
                  You don't have any enrolled courses yet. Enroll into a course
                  today and start learning something new.
                </p>
                <Link
                  to="/student/dashboard"
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Explore Courses
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-md h-40 animate-pulse"
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollement;
