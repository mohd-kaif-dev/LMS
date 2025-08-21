import React from "react";
import {
  BookOpen,
  DraftingCompass,
  Users,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

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
// InstructorDashboard Component - The main dashboard container
// ======================================================================
const InstructorDashboard = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {authUser?.name.split(" ")[0]}&apos;s Dashboard
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          An overview of your teaching performance and courses.
        </p>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<BookOpen size={24} />}
            title="Total Courses"
            value={authUser?.totalCourses}
            description="Published and available to students."
            color="bg-purple-600"
          />
          <StatCard
            icon={<DraftingCompass size={24} />}
            title="Drafts"
            value="3"
            description="Courses in progress or unpublished."
            color="bg-red-600"
          />
          <StatCard
            icon={<Users size={24} />}
            title="Enrolled Students"
            value={authUser?.totalStudents}
            description="Total students enrolled in your courses."
            color="bg-blue-600"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            title="Avg. Course Rating"
            value={authUser?.rating}
            description="Average rating across all your courses."
            color="bg-green-600"
          />
          <StatCard
            icon={<BarChart2 size={24} />}
            title="Minutes Watched"
            value="2.5M"
            description="Total minutes students spent watching."
            color="bg-yellow-600"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            title="Monthly Growth"
            value="+12%"
            description="Enrollment growth this month."
            color="bg-pink-600"
          />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
