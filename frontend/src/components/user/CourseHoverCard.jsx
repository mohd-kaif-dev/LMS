import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  BookOpen,
  Clock,
  CheckCircle,
  Award,
  Star,
  Zap,
} from "lucide-react";

// ======================================================================
// Popover Component - The hover div that appears next to the card
// ======================================================================
const CoursePopover = ({ course, position }) => {
  return (
    <div
      className="absolute bg-white text-black p-4 rounded-lg shadow-lg z-10 w-80"
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(20px)",
      }}
    >
      <h3 className="text-lg font-bold mb-2">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{course.description}</p>
      <div className="flex items-center text-sm mb-2">
        <span className="font-semibold text-yellow-500 mr-1">
          {course.rating}
        </span>
        <Star size={16} className="text-yellow-500 mr-1" />
        <span className="text-gray-500">({course.reviews})</span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-xl font-bold">${course.price}</p>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
            <ShoppingCart size={20} />
          </button>
          <button className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// CourseCard Component - The individual course card
// ======================================================================
const CourseCard = ({ course, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)}
      className="bg-gray-100 rounded-lg text-black overflow-hidden shadow-lg flex flex-col justify-between cursor-pointer relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative pb-2">
        {course.isStaffPick && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Staff Pick
          </span>
        )}
        <img
          src={course.thumbnailUrl || course.imageUrl}
          alt={course.title}
          className="w-full h-40 object-cover mb-2"
          loading="lazy"
        />
        <div className="flex justify-between items-center px-2 bg-gray-200 mb-2">
          <span className="text-xs">
            {course.studentsEnrolled?.length || course.students} students
          </span>
          <span className="text-xs">{course.duration || "2h3m"}</span>
        </div>
        <h3 className="text-md font-semibold px-2 mb-2">{course.title}</h3>
      </div>
      <div className="flex items-center text-sm justify-between px-2">
        <p className="text-sm text-gray-900 mb-2">
          {course.instructor?.name || course.instructor || "John Doe"}
        </p>
        <div className="flex items-center space-x-1">
          <Star size={14} fill="currentColor" className="text-yellow-400" />
          <span>{course.rating || "4.5"}</span>
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// CourseGrid Component - Container for the course cards and popover
// ======================================================================
const CourseHoverCard = (course) => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  //   // Mock data for demonstration
  //   const courses = [
  //     {
  //       _id: '1',
  //       title: 'Fundamentals of Modern Web Development',
  //       instructor: { name: 'Vetrivel Ravi' },
  //       isStaffPick: true,
  //       thumbnailUrl: 'https://placehold.co/400x200/60a5fa/ffffff?text=Web+Dev',
  //       students: 1200,
  //       duration: '4.5 hrs',
  //       rating: 4.5,
  //       reviews: 1234,
  //       price: 479,
  //       description: 'Learn the core principles of modern web development from basics to live deployment.',
  //     },
  //     {
  //       _id: '2',
  //       title: 'Code & Play: JavaScript Game Projects',
  //       instructor: { name: 'Andrew Tyranowski' },
  //       isStaffPick: false,
  //       thumbnailUrl: 'https://placehold.co/400x200/10b981/ffffff?text=JS+Games',
  //       students: 850,
  //       duration: '3.0 hrs',
  //       rating: 4.7,
  //       reviews: 987,
  //       price: 349,
  //       description: 'Build fun and interactive games using pure JavaScript.',
  //     },
  //     // Add more mock courses here
  //   ];

  const handleMouseEnter = (event, course) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width,
    });
    setHoveredCourse(course);
  };

  const handleMouseLeave = () => {
    setHoveredCourse(null);
  };

  return (
    <div className="relative">
      <div
        key={course._id}
        className="relative"
        onMouseEnter={(e) => handleMouseEnter(e, course)}
        onMouseLeave={handleMouseLeave}
      >
        <CourseCard course={course} />
      </div>

      {hoveredCourse && (
        <CoursePopover course={hoveredCourse} position={popoverPosition} />
      )}
    </div>
  );
};

export default CourseHoverCard;
