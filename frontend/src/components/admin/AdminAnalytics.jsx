import React from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Clock,
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
// SiteAnalytics Component - The main component for site analytics
// ======================================================================
const AdminAnalytics = () => {
  // Mock Data for the analytics dashboard
  const stats = [
    {
      icon: <Users size={24} />,
      title: "Total Learners",
      value: "25,489",
      description: "Total active users.",
      color: "bg-indigo-600",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Courses Enrolled",
      value: "18,500",
      description: "Total enrollments.",
      color: "bg-green-600",
    },
    {
      icon: <DollarSign size={24} />,
      title: "Monthly Revenue",
      value: "$75k",
      description: "Revenue in the last 30 days.",
      color: "bg-yellow-600",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Avg. Course Completion",
      value: "65%",
      description: "Average completion rate.",
      color: "bg-teal-600",
    },
  ];

  const topCourses = [
    { title: "Full Stack Web Dev", enrollments: "1,250", revenue: "$5,000" },
    { title: "React.js Fundamentals", enrollments: "980", revenue: "$3,800" },
    { title: "Python for Data Science", enrollments: "850", revenue: "$3,200" },
    { title: "UX/UI Design Principles", enrollments: "720", revenue: "$2,500" },
    { title: "Advanced CSS & Tailwind", enrollments: "610", revenue: "$2,100" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Site Analytics</h1>
        <p className="text-lg text-gray-400 mb-12">
          An in-depth look at key performance metrics and trends.
        </p>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ChartCard title="User Growth Over Time">
            <LineChart size={48} />
            <span className="ml-2">Line Chart Placeholder</span>
          </ChartCard>
          <ChartCard title="Course Enrollment by Category">
            <BarChart size={48} />
            <span className="ml-2">Bar Chart Placeholder</span>
          </ChartCard>
          <ChartCard title="Revenue Per Course">
            <DollarSign size={48} />
            <span className="ml-2">Bar Chart Placeholder</span>
          </ChartCard>
          <ChartCard title="Traffic Sources">
            <PieChart size={48} />
            <span className="ml-2">Pie Chart Placeholder</span>
          </ChartCard>
        </div>

        {/* Top Courses Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Top Courses by Enrollment
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-sm font-semibold text-gray-400">
                  <th scope="col" className="py-3 px-4">
                    Rank
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Course Title
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Enrollments
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((course, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="py-4 px-4">{index + 1}</td>
                    <td className="py-4 px-4">{course.title}</td>
                    <td className="py-4 px-4">{course.enrollments}</td>
                    <td className="py-4 px-4">{course.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
