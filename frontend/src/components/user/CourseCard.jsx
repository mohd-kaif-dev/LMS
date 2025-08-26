import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Users, Clock, ArrowRight, Zap } from "lucide-react";
import { formatTime } from "../../utils/constant";

// ======================================================================
// Enhanced CourseCard Component
// ======================================================================
const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  // Helper to handle potentially different data structures for instructor name
  const getInstructorName = (instructor) => {
    if (typeof instructor === "string") return instructor;
    if (typeof instructor === "object" && instructor !== null)
      return instructor.name;
    return "N/A";
  };

  // Assuming a consistent structure for course data, but providing fallbacks
  const {
    _id,
    title = "Untitled Course",
    thumbnailUrl,
    imageUrl, // Fallback for different property names
    instructor = { name: "Unknown Instructor" },
    price = 0,
    rating = 0,
    studentsEnrolled,
    students, // Fallback
    totalDuration = "N/A",
    isBestseller, // Using a more common flag like 'isBestseller'
  } = course;

  const studentCount = studentsEnrolled?.length ?? students ?? 0;

  return (
    <div
      onClick={() =>
        navigate(`/courses/${title.replace(/\s+/g, "-")}`, {
          state: {
            id: _id,
          },
        })
      }
      className="group relative bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg 
                 transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-2 cursor-pointer"
    >
      {/* --- Image and Bestseller Badge --- */}
      <div className="relative">
        <img
          src={
            thumbnailUrl ||
            imageUrl ||
            "https://placehold.co/400x250/1e293b/94a3b8?text=Course"
          }
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay with View Course button on hover */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-2 text-white font-semibold py-2 px-4 border-2 border-white rounded-full">
            View Course <ArrowRight size={20} />
          </span>
        </div>

        {isBestseller && (
          <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
            <Zap size={14} /> Bestseller
          </span>
        )}
      </div>

      {/* --- Course Content --- */}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="text-lg font-bold text-slate-100 mb-2 h-14 line-clamp-2"
          title={title}
        >
          {title}
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          by {getInstructorName(instructor)}
        </p>

        {/* --- Informative Badges --- */}
        <div className="flex items-center justify-between text-sm text-slate-300 mb-4">
          <div
            className="flex items-center gap-2"
            title={`${studentCount.toLocaleString()} students`}
          >
            <Users size={16} className="text-cyan-400" />
            <span>{studentCount.toLocaleString()}</span>
          </div>
          <div
            className="flex items-center gap-2"
            title={`Course duration: ${totalDuration}`}
          >
            <Clock size={16} className="text-cyan-400" />
            <span>{formatTime(totalDuration).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1" title={`Rating: ${rating}`}>
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-semibold">{rating}</span>
          </div>
        </div>

        {/* Spacer to push the footer down */}
        <div className="flex-grow"></div>

        {/* --- Footer with Price and Wishlist --- */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <p className="text-2xl font-bold text-white">
            ₹{price.toLocaleString()}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking the heart
              alert("Added to wishlist!");
            }}
            className="p-2 rounded-full text-slate-400 hover:text-pink-500 hover:bg-pink-500/10 transition-colors duration-200"
            aria-label="Add to wishlist"
          >
            <Heart size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
