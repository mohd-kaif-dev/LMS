import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Trophy, Zap } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import DashboardCourses from "./DashboardCourses";

// ======================================================================
// Reusable UI Components
// ======================================================================

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ icon, title, value, color, description }) => {
  return (
    <GlassCard
      className={`relative overflow-hidden p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 border-t-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">{title}</p>
        <div className="text-slate-400">{icon}</div>
      </div>
      <p className="mt-2 text-4xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </GlassCard>
  );
};

// ======================================================================
// Dashboard Sections
// ======================================================================

const Stats = () => {
  const studentStats = [
    {
      icon: <BookOpen size={24} />,
      title: "Courses Enrolled",
      value: "8",
      description: "Keep learning!",
      color: "border-blue-500",
    },
    {
      icon: <Clock size={24} />,
      title: "Hours Learned",
      value: "125",
      description: "Time well spent.",
      color: "border-green-500",
    },
    {
      icon: <Trophy size={24} />,
      title: "Courses Completed",
      value: "3",
      description: "Great achievements!",
      color: "border-yellow-500",
    },
    {
      icon: <Zap size={24} />,
      title: "Learning Streak",
      value: "12 days",
      description: "Don't break the chain.",
      color: "border-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {studentStats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

// ======================================================================
// Main Dashboard Component
// ======================================================================
const Dashboard = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) navigate("/sign-in");
    else if (authUser.role !== "student") navigate("/instructor/dashboard");
  }, [authUser, navigate]);

  return (
    <div className="text-slate-200 min-h-screen p-4 sm:p-8 animated-gradient">
      <div className="container mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome back, {authUser?.name}!
          </h1>
          <p className="text-lg text-slate-400 mt-2">
            Let's continue your learning journey.
          </p>
        </header>

        <Stats />

        <main className="space-y-12">
          <DashboardCourses title="Featured Courses" slug="featured" />
          <DashboardCourses title="Trending in Animation" slug="animation" />
          <DashboardCourses title="Popular in UI/UX" slug="ui-ux" />
          <DashboardCourses title="Top Pick in Web Design" slug="web-design" />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
