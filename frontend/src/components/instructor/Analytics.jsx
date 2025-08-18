import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  ExternalLink,
  MessageCircle,
  BarChart,
  LineChart,
} from "lucide-react";

// ======================================================================
// StatCard Component - A reusable card for displaying a single metric
// ======================================================================
const StatCard = ({ icon, title, value, description, color }) => {
  return (
    <div
      className={`flex flex-col p-6 rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 ${color} text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="p-3 rounded-full bg-white bg-opacity-20">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
};

// ======================================================================
// ChartCard Component - A reusable card for chart placeholders
// ======================================================================
const ChartCard = ({ title, children }) => (
  <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
      {title}
    </h3>
    <div className="flex items-center justify-center h-64 text-gray-500 bg-gray-700 rounded-lg">
      {children}
    </div>
  </div>
);

// ======================================================================
// InstructorAnalytics Component - The main component for instructor analytics
// ======================================================================
const InstructorAnalytics = () => {
  // Mock Data for the analytics dashboard
  const instructorStats = [
    {
      icon: <Users size={24} />,
      title: "Total Students",
      value: "1,520",
      description: "Total enrollments across all courses.",
      color: "bg-indigo-600",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Active Courses",
      value: "5",
      description: "Number of courses currently live.",
      color: "bg-green-600",
    },
    {
      icon: <DollarSign size={24} />,
      title: "Total Revenue",
      value: "$25k",
      description: "Lifetime earnings from courses.",
      color: "bg-yellow-600",
    },
    {
      icon: <Star size={24} />,
      title: "Average Rating",
      value: "4.8",
      description: "Average rating across all courses.",
      color: "bg-teal-600",
    },
  ];

  const coursePerformance = [
    {
      id: 1,
      title: "Full Stack Web Dev",
      enrollments: "850",
      completionRate: "68%",
      revenue: "$12,500",
      rating: "4.9",
    },
    {
      id: 2,
      title: "React.js Fundamentals",
      enrollments: "420",
      completionRate: "75%",
      revenue: "$7,800",
      rating: "4.8",
    },
    {
      id: 3,
      title: "Advanced CSS & Tailwind",
      enrollments: "250",
      completionRate: "82%",
      revenue: "$4,700",
      rating: "4.7",
    },
  ];

  const recentStudentActivity = [
    {
      student: "Alex Johnson",
      action: 'completed "Intro to React"',
      time: "2 mins ago",
    },
    {
      student: "Maria Garcia",
      action: 'enrolled in "Advanced CSS"',
      time: "1 hour ago",
    },
    {
      student: "David Kim",
      action: 'left a review for "Full Stack Dev"',
      time: "4 hours ago",
    },
    {
      student: "Jessica Lee",
      action: 'started "React.js Fundamentals"',
      time: "1 day ago",
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Instructor Analytics
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          A detailed view of your performance and student engagement.
        </p>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {instructorStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Earnings Chart Section */}
        <ChartCard title="Monthly Earnings">
          <LineChart size={48} />
          <span className="ml-2">Line Chart Placeholder</span>
        </ChartCard>

        {/* Course Performance Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Course Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-sm font-semibold text-gray-400">
                  <th scope="col" className="py-3 px-4">
                    Course Title
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Enrollments
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Completion Rate
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Revenue
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {coursePerformance.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="py-4 px-4">{course.title}</td>
                    <td className="py-4 px-4">{course.enrollments}</td>
                    <td className="py-4 px-4">{course.completionRate}</td>
                    <td className="py-4 px-4">{course.revenue}</td>
                    <td className="py-4 px-4 flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400" />
                      <span>{course.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Student Activity Section */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Recent Student Activity
          </h2>
          <ul className="space-y-4">
            {recentStudentActivity.map((activity, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 text-gray-300"
              >
                <MessageCircle
                  size={20}
                  className="text-blue-400 flex-shrink-0 mt-1"
                />
                <div>
                  <p className="font-semibold">
                    {activity.student}{" "}
                    <span className="font-normal">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                    <Clock size={12} />
                    <span>{activity.time}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
