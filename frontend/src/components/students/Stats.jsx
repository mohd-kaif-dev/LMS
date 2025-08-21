import React from "react";
import { BookOpen, Clock, CheckCircle, Award, Star, Zap } from "lucide-react";

// ======================================================================
// StatCard Component - A reusable card to display a single metric
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
// Stats Component - The main component for the student dashboard stats
// ======================================================================
const Stats = () => {
  // Mock data for the student stats dashboard
  const studentStats = [
    {
      icon: <BookOpen size={24} />,
      title: "Enrolled Courses",
      value: "8",
      description: "Total courses you are currently enrolled in.",
      color: "bg-indigo-600",
    },
    {
      icon: <Clock size={24} />,
      title: "Hours Spent",
      value: "125",
      description: "Total video and lecture time watched.",
      color: "bg-green-600",
    },
    {
      icon: <CheckCircle size={24} />,
      title: "Courses Completed",
      value: "3",
      description: "Total number of courses you have finished.",
      color: "bg-yellow-600",
    },
  ];

  return (
    <div className="mb-8">
      <div className="container mx-auto px-8">
        {/* Header Section */}
        <p className="text-lg text-gray-800 mb-12 text-center">
          Get a glimpse into your learning journey and track your progress with
          exciting metrics!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
