import React from "react";
import { FaUserGraduate, FaStar, FaDollarSign, FaCrown } from "react-icons/fa";

const CourseCard = ({ course }) => {
  const { thumbnailUrl, title, rating, price, dificulty, studentsEnrolled } =
    course;

  const getDifficultyColor = (dificulty) => {
    switch (dificulty.toLowerCase()) {
      case "beginner":
        return "text-green-500 bg-green-100";
      case "intermediate":
        return "text-yellow-500 bg-yellow-100";
      case "advanced":
        return "text-red-500 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const difficultyClass = getDifficultyColor(dificulty);

  return (
    <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-white dark:bg-gray-800 transform hover:scale-105">
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={thumbnailUrl}
          alt={`Thumbnail for ${title}`}
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${difficultyClass}`}
        >
          {dificulty}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white line-clamp-2">
          {title}
        </h2>
        {/* <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FaCrown className="mr-2 text-yellow-500" />
          <span className="text-sm">{instructor.name}</span>
        </div> */}
        <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaUserGraduate className="text-blue-500" />
            <span className="text-sm font-medium">
              {studentsEnrolled.length}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Students
            </span>
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="flex items-center text-2xl font-bold text-blue-600 dark:text-blue-400">
            <FaDollarSign className="text-lg mr-1" />
            {price.toFixed(2)}
          </span>
          <button className="px-5 py-2 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-md">
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
