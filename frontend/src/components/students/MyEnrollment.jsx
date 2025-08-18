import React from "react";
import { BookOpen, Star, TrendingUp, CheckCircle } from "lucide-react";

// ======================================================================
// CourseCard Component - A reusable card for displaying an enrolled course
// ======================================================================
const EnrolledCourseCard = ({ course }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg p-6 transition-transform duration-200 hover:scale-[1.02]">
      <div className="relative mb-4">
        {/* Course Image */}
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-40 object-cover rounded-md"
        />
        {/* Progress Bar */}
        <div className="absolute bottom-2 left-0 right-0 h-2 bg-gray-700 mx-4 rounded-full">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Course Details */}
      <div className="relative">
        <h3 className="text-xl font-semibold text-white mb-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-400 mb-2">by {course.author}</p>

        {/* Progress and completion status */}
        <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
          <div className="flex items-center space-x-2">
            <TrendingUp size={16} />
            <span>{course.progress}% Complete</span>
          </div>
          {course.progress === 100 && (
            <div className="flex items-center space-x-1 text-blue-500">
              <CheckCircle size={16} />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// MyEnrollement Component - The main page for enrolled students
// ======================================================================
const MyEnrollement = () => {
  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to Web Design",
      author: "Jane Doe",
      imageUrl: "https://placehold.co/400x250/1F2937/ffffff?text=Course+1",
      progress: 75,
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      author: "John Smith",
      imageUrl: "https://placehold.co/400x250/1F2937/ffffff?text=Course+2",
      progress: 100,
    },
    {
      id: 3,
      title: "Creative Photography Basics",
      author: "Emily White",
      imageUrl: "https://placehold.co/400x250/1F2937/ffffff?text=Course+3",
      progress: 25,
    },
    {
      id: 4,
      title: "Digital Marketing 101",
      author: "Michael Brown",
      imageUrl: "https://placehold.co/400x250/1F2937/ffffff?text=Course+4",
      progress: 50,
    },
    {
      id: 5,
      title: "Figma UI/UX Design Fundamentals",
      author: "Sarah Lee",
      imageUrl: "https://placehold.co/400x250/1F2937/ffffff?text=Course+5",
      progress: 90,
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2">My Courses</h1>
        <p className="text-lg text-gray-400 mb-12">
          Your enrolled courses and progress.
        </p>

        {/* Enrolled Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <EnrolledCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyEnrollement;
