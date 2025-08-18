import {
  User,
  BookOpen,
  DollarSign,
  Star,
  MessageCircle,
  Plus,
  Edit,
  ExternalLink,
  Users,
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
// InstructorProfile Component - The main component for the instructor's profile
// ======================================================================
const InstructorProfile = () => {
  // Mock data for the instructor's profile
  const instructor = {
    name: "Jane Smith",
    bio: "Experienced full-stack developer with a passion for teaching. I love to help people build amazing things with modern web technologies.",
    profilePicture: "https://placehold.co/150x150/60a5fa/ffffff?text=JS",
    stats: [
      {
        icon: <Users size={20} />,
        title: "Total Students",
        value: "1,520",
        color: "bg-indigo-600",
      },
      {
        icon: <BookOpen size={20} />,
        title: "Published Courses",
        value: "5",
        color: "bg-green-600",
      },
      {
        icon: <DollarSign size={20} />,
        title: "Total Revenue",
        value: "$25k",
        color: "bg-yellow-600",
      },
      {
        icon: <Star size={20} />,
        title: "Average Rating",
        value: "4.8",
        color: "bg-teal-600",
      },
    ],
  };

  const courses = [
    {
      id: 1,
      title: "Full Stack Web Dev",
      students: "850",
      rating: "4.9",
      status: "Published",
    },
    {
      id: 2,
      title: "React.js Fundamentals",
      students: "420",
      rating: "4.8",
      status: "Published",
    },
    {
      id: 3,
      title: "Advanced CSS & Tailwind",
      students: "250",
      rating: "4.7",
      status: "Published",
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 mb-12">
          <img
            src={instructor.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-green-500"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {instructor.name}
            </h1>
            <p className="text-lg text-gray-400 mt-1">Instructor</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
            About Me
          </h2>
          <p className="text-gray-300">{instructor.bio}</p>
        </div>

        {/* Instructor Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {instructor.stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* My Courses Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-white">My Courses</h2>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-600 transition-colors duration-200">
              <Plus size={20} />
              <span>New Course</span>
            </button>
          </div>
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-700 rounded-xl transition-colors duration-200 hover:bg-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <BookOpen size={24} className="text-blue-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-semibold">{course.title}</h4>
                    <p className="text-sm text-gray-400">
                      {course.students} Students • Rating: {course.rating}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.status === "Published"
                        ? "bg-green-500 text-black"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {course.status}
                  </span>
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

export default InstructorProfile;
