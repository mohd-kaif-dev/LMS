import { FaCheckCircle, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/course/${course._id}`)}
      className="bg-gray-100 rounded-lg text-black overflow-hidden shadow-lg flex flex-col justify-between cursor-pointer"
    >
      <div className="relative pb-2">
        {/* Staff Pick Badge */}
        {course.isStaffPick && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <FaCheckCircle size={14} className="mr-1" />
            Staff Pick
          </span>
        )}

        {/* Course Image */}
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

        {/* Course Details */}

        <h3 className="text-md font-semibold px-2 mb-2">{course.title}</h3>
      </div>

      {/* Statistics */}
      <div className="flex items-center text-sm justify-between px-2">
        <p className="text-sm text-gray-900 mb-2">
          {course.instructor.name || course.instructor}
        </p>
        <div className="flex items-center space-x-1">
          <FaRegStar
            size={14}
            fill="currentColor"
            className="text-yellow-400"
          />
          <span>{course.rating || "4.5"}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
