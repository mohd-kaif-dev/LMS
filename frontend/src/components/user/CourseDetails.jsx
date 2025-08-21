import React, { useEffect, useState } from "react";
import {
  Star,
  PlayCircle,
  ChevronDown,
  CheckCircle,
  ChevronUp,
  Loader2,
  Share2,
  Clock,
  Video,
  FileText,
  Award,
  Smartphone,
  Infinity,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useCourseStore from "../../store/useCourseStore";

// ======================================================================
// Helper & UI Components
// ======================================================================

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 ${className}`}
  >
    {children}
  </div>
);

const AccordionItem = ({ section, isOpen, onClick }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300">
    <button
      className="flex items-center justify-between w-full p-4 text-left hover:bg-slate-700/50"
      onClick={onClick}
    >
      <span className="font-semibold text-slate-100">{section.title}</span>
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <span>{section.lessons.length} lectures</span>
        <ChevronUp
          size={20}
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>
    <div
      className={`grid transition-all duration-500 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="p-4 border-t border-slate-700">
          <ul className="space-y-3">
            {section.lessons.map((lesson, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-slate-300"
              >
                <span className="flex items-center gap-3">
                  <PlayCircle size={16} className="text-slate-500" />
                  {lesson.title}
                </span>
                <span className="text-xs text-slate-400">
                  {lesson.duration}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// ======================================================================
// CourseDetails Component - The main page
// ======================================================================
const CourseDetails = () => {
  const [openSection, setOpenSection] = useState(0);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { selectedCourse, fetchCourseById, isFetching } = useCourseStore();

  useEffect(() => {
    fetchCourseById(courseId);
    window.scrollTo(0, 0);
  }, [fetchCourseById, courseId]);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (isFetching || !selectedCourse) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  const discountPercentage = Math.floor(
    ((selectedCourse.originalPrice - selectedCourse.price) /
      selectedCourse.originalPrice) *
      100
  );

  const courseIncludes = [
    {
      icon: <Video size={18} />,
      text: `${formatDuration(selectedCourse.totalDuration)} on-demand video`,
    },
    { icon: <FileText size={18} />, text: "Downloadable resources" },
    { icon: <Smartphone size={18} />, text: "Access on mobile and TV" },
    { icon: <Infinity size={18} />, text: "Full lifetime access" },
    { icon: <Award size={18} />, text: "Certificate of completion" },
  ];

  return (
    <div className="bg-slate-900 text-slate-200 font-sans">
      {/* --- Hero Section --- */}
      <div className="relative bg-slate-800 text-white py-16 md:py-24 px-4 overflow-hidden">
        <img
          src={selectedCourse.thumbnailUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {selectedCourse.title}
            </h1>
            <p className="text-xl text-slate-300 mb-6">
              {selectedCourse.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-yellow-400">
                  {selectedCourse.rating}
                </span>
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-slate-400">
                  ({selectedCourse.numReviews.toLocaleString()} ratings)
                </span>
              </div>
              <span className="text-slate-300">
                {selectedCourse.studentsEnrolled.length.toLocaleString()}{" "}
                students
              </span>
              <span className="text-slate-400">
                Created by{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  {selectedCourse.instructor.name}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-8">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {selectedCourse.learningOutcomes.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle
                      size={18}
                      className="text-blue-400 mt-1 flex-shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Course content</h2>
              <p className="text-sm text-slate-400">
                {selectedCourse.sections.length} sections •{" "}
                {selectedCourse.totalLectures} lectures •{" "}
                {formatDuration(selectedCourse.totalDuration)} total length
              </p>
              {selectedCourse.sections.map((section, index) => (
                <AccordionItem
                  key={index}
                  section={section}
                  isOpen={openSection === index}
                  onClick={() => toggleSection(index)}
                />
              ))}
            </div>

            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {selectedCourse.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-slate-300 whitespace-pre-line">
                {selectedCourse.detailedDescription}
              </p>
            </GlassCard>
          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-8 space-y-4">
              <GlassCard className="overflow-hidden">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <PlayCircle
                    size={64}
                    className="text-white/50 hover:text-white/80 transition-colors cursor-pointer"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-white">
                      ₹{selectedCourse.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{selectedCourse.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-base font-semibold text-green-400">
                      {discountPercentage}% off
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/cart/${selectedCourse?.title.replace(/\s+/g, "-")}`,
                        {
                          state: {
                            id: selectedCourse?._id,
                          },
                        }
                      )
                    }
                    className="w-full group flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-transform duration-300"
                  >
                    Enroll Now
                  </button>
                  <p className="text-xs text-slate-400 text-center mt-3">
                    30-Day Money-Back Guarantee
                  </p>
                </div>
              </GlassCard>
              <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-4">
                  This course includes:
                </h3>
                <ul className="space-y-3 text-sm">
                  {courseIncludes.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {React.cloneElement(item.icon, {
                        className: "text-slate-400",
                      })}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
