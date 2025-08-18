import {
  User,
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  ExternalLink,
} from "lucide-react";

// ======================================================================
// StatCard Component - Reusable for displaying a single metric
// ======================================================================
const StatCard = ({ icon, title, value, color }) => {
  return (
    <div
      className={`flex flex-col p-6 rounded-2xl shadow-lg ${color} text-white`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="p-3 rounded-full bg-white bg-opacity-20">{icon}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
};

// ======================================================================
// CourseProgress Component - Displays a progress bar for a course
// ======================================================================
const CourseProgress = ({ progress }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div
        className="bg-green-500 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// ======================================================================
// StudentProfile Component - The main component for the student's profile
// ======================================================================
const StudentProfile = () => {
  // Mock data for the student's profile
  const student = {
    name: "Alex Johnson",
    bio: "Passionate learner and aspiring developer. Currently studying front-end and full-stack development to build my portfolio.",
    profilePicture: "https://placehold.co/150x150/10b981/ffffff?text=AJ",
    stats: [
      {
        icon: <BookOpen size={20} />,
        title: "Enrolled Courses",
        value: "8",
        color: "bg-indigo-600",
      },
      {
        icon: <CheckCircle size={20} />,
        title: "Courses Completed",
        value: "3",
        color: "bg-green-600",
      },
      {
        icon: <Clock size={20} />,
        title: "Hours Watched",
        value: "125",
        color: "bg-yellow-600",
      },
      {
        icon: <Award size={20} />,
        title: "Badges Earned",
        value: "5",
        color: "bg-teal-600",
      },
    ],
  };

  const enrolledCourses = [
    {
      id: 1,
      title: "Full Stack Web Dev",
      instructor: "Jane Smith",
      progress: 68,
    },
    {
      id: 2,
      title: "React.js Fundamentals",
      instructor: "John Doe",
      progress: 95,
    },
    {
      id: 3,
      title: "Advanced CSS & Tailwind",
      instructor: "Jane Smith",
      progress: 25,
    },
    { id: 4, title: "Intro to Python", instructor: "Sarah Lee", progress: 100 },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-12">
          <img
            src={student.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-green-500"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">{student.name}</h1>
            <p className="text-lg text-gray-400 mt-1">Student</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
            About Me
          </h2>
          <p className="text-gray-300">{student.bio}</p>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {student.stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            My Courses
          </h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-700 rounded-xl transition-colors duration-200 hover:bg-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <BookOpen size={24} className="text-blue-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold">{course.title}</h4>
                    <p className="text-sm text-gray-400">
                      Instructor: {course.instructor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="w-24">
                    <p className="text-sm text-gray-400 mb-1">
                      Progress: {course.progress}%
                    </p>
                    <CourseProgress progress={course.progress} />
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors duration-200">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
