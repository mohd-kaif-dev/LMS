import React from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  BarChart,
  User,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
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
// DashboardSection Component - A reusable container for different sections
// ======================================================================
const DashboardSection = ({ title, children }) => (
  <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
      {title}
    </h2>
    {children}
  </div>
);

// ======================================================================
// AdminDashboard Component - The main dashboard container
// ======================================================================
const AdminDashboard = () => {
  // Mock Data for the dashboard
  const stats = [
    {
      icon: <Users size={24} />,
      title: "Total Users",
      value: "25,489",
      description: "Total registered users on the platform.",
      color: "bg-indigo-600",
    },
    {
      icon: <BookOpen size={24} />,
      title: "Total Courses",
      value: "1,250",
      description: "Total published courses.",
      color: "bg-green-600",
    },
    {
      icon: <DollarSign size={24} />,
      title: "Total Revenue",
      value: "$8.5M",
      description: "Revenue generated this year.",
      color: "bg-yellow-600",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "New Signups (30d)",
      value: "1,562",
      description: "New users joined in the last 30 days.",
      color: "bg-teal-600",
    },
  ];

  const recentActivities = [
    { type: "New User", name: "Alex Johnson", time: "5 mins ago" },
    { type: "Course Approved", name: "React Fundamentals", time: "1 hour ago" },
    { type: "New Course", name: "Advanced Python", time: "2 hours ago" },
    { type: "User Reported", name: "Jane Doe", time: "1 day ago" },
  ];

  const courseReviews = [
    { title: "UX Design Course", status: "Pending" },
    { title: "Node.js Backend Course", status: "Approved" },
    { title: "CSS Mastery", status: "Rejected" },
    { title: "Data Science with Python", status: "Pending" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-400 mb-12">
          An overview of the platform's key metrics and recent activities.
        </p>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Analytics and Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardSection title="Platform Analytics">
              <div className="bg-gray-700 h-96 rounded-xl flex items-center justify-center text-gray-400 text-lg">
                <BarChart size={48} className="mr-2" /> Placeholder for Chart
              </div>
            </DashboardSection>
          </div>

          <DashboardSection title="Recent Activities">
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 text-gray-300"
                >
                  <MessageCircle
                    size={20}
                    className="text-blue-400 flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold">
                      {activity.type}: {activity.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                      <Clock size={12} />
                      <span>{activity.time}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </DashboardSection>
        </div>

        {/* Course Review Section */}
        <div className="mt-8">
          <DashboardSection title="Course Submissions for Review">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700 text-sm font-semibold text-gray-400">
                    <th scope="col" className="py-3 px-4">
                      Course Title
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Status
                    </th>
                    <th scope="col" className="py-3 px-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courseReviews.map((review, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">{review.title}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            review.status === "Approved"
                              ? "bg-green-500 text-black"
                              : review.status === "Rejected"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-black"
                          }`}
                        >
                          {review.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-green-500 hover:text-green-400 mr-2">
                          <CheckCircle size={20} />
                        </button>
                        <button className="text-red-500 hover:text-red-400">
                          <XCircle size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
