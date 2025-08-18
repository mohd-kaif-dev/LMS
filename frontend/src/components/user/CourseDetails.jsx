import React, { useState } from "react";
import {
  Star,
  PlayCircle,
  Clock,
  Download,
  FileText,
  Smartphone,
  Award,
  ChevronDown,
  CheckCircle,
  ChevronUp,
} from "lucide-react";

// ======================================================================
// AccordionItem Component - Reusable component for the course structure
// ======================================================================
const AccordionItem = ({ section, isOpen, onClick }) => {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden mb-2">
      <button
        className="flex items-center justify-between w-full p-4 text-white hover:bg-gray-700 transition-colors duration-200"
        onClick={onClick}
      >
        <span className="flex items-center space-x-2">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          <span className="font-semibold text-lg">{section.title}</span>
        </span>
        <span className="text-sm text-gray-400">
          {section.lessons.length} lectures • {section.duration}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          {section.lessons.map((lesson, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 text-gray-300 border-b border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <PlayCircle size={16} />
                <span>{lesson.title}</span>
              </div>
              <span className="text-xs text-gray-400">{lesson.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ======================================================================
// CourseDetail Component - The main page for course details
// ======================================================================
const CourseDetails = () => {
  const [openSection, setOpenSection] = useState(0);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  //   const courseId = new URLSearchParams(window.location.search).get("id");

  const courseData = {
    title: "Complete web development course",
    subtitle:
      "Only web development course that you will need. Covers HTML, CSS, Tailwind, Node, React, MongoDB, Prisma, Deployment etc",
    author: "Hitesh Choudhary",
    lastUpdated: "06/2025",
    rating: 4.6,
    ratingsCount: "14,385",
    learners: "51,909",
    whatYoullLearn: [
      "Become a full stack developer",
      "Master of Javascript ecosystem",
      "Build any project for your company or for freelance projects",
      "Full stack with MERN, GIT and many advance tools",
    ],
    courseIncludes: [
      { icon: <Clock size={20} />, text: "86.5 hours on-demand video" },
      { icon: <Download size={20} />, text: "29 downloadable resources" },
      { icon: <Smartphone size={20} />, text: "Access on mobile and TV" },
      { icon: <FileText size={20} />, text: "45 coding exercises" },
      { icon: <FileText size={20} />, text: "5 articles" },
      { icon: <Award size={20} />, text: "Certificate of completion" },
    ],
    courseContent: [
      {
        title: "Before web dev Journey",
        duration: "1h 1min",
        lessons: [
          { title: "Course Introduction - Roadmap", duration: "11:26" },
          { title: "Meet your Instructor - Hitesh", duration: "05:26" },
          { title: "Lets talk about AI hype", duration: "06:11" },
          { title: "Jobs salary range and skills", duration: "10:21" },
          {
            title: "What tools you need for web development",
            duration: "09:50",
          },
          { title: "How to setup your code editor", duration: "18:04" },
        ],
      },
      {
        title: "Code files - Download here",
        duration: "1min",
        lessons: [{ title: "Code files to download", duration: "01:00" }],
      },
      {
        title: "Basics of web development",
        duration: "23min",
        lessons: [
          { title: "HTML crash course", duration: "12:00" },
          { title: "CSS essentials", duration: "08:00" },
          { title: "JavaScript basics", duration: "03:00" },
        ],
      },
      {
        title: "Learn HTML",
        duration: "44min",
        lessons: [
          { title: "HTML Intro", duration: "10:00" },
          { title: "HTML Basic", duration: "12:00" },
          { title: "HTML Advanced", duration: "22:00" },
        ],
      },
    ],
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased">
      {/* Hero Section */}
      <div className="bg-gray-800 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Left Content */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {courseData.title}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                {courseData.subtitle}
              </p>
              <p className="text-gray-400 mb-2">
                Created by{" "}
                <span className="text-blue-500 font-semibold">
                  {courseData.author}
                </span>
              </p>
              <p className="text-gray-400 mb-6">
                Last updated {courseData.lastUpdated}
              </p>

              {/* Ratings and Learners */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center">
                  <span className="text-yellow-400 font-bold text-xl mr-1">
                    {courseData.rating}
                  </span>
                  <Star
                    size={18}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                </div>
                <span className="text-gray-400">
                  {courseData.ratingsCount} ratings
                </span>
                <span className="text-gray-400">
                  {courseData.learners} learners
                </span>
              </div>

              {/* What you'll learn */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseData.whatYoullLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle
                        size={20}
                        className="text-blue-500 mt-1 flex-shrink-0"
                      />
                      <p className="text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course includes */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  This course includes:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseData.courseIncludes.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 text-gray-300"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Video Player and Pricing */}
            <div className="lg:w-96 mt-8 lg:mt-0 bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <PlayCircle size={64} className="text-blue-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Price goes here</h2>
              <button className="w-full py-3 rounded-full bg-blue-500 text-black font-semibold hover:bg-blue-600 transition-colors duration-200 mb-2">
                Buy now
              </button>
              <button className="w-full py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors duration-200">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Left Content - Course Structure */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Course content</h2>
            <div className="mb-4 text-gray-400">
              34 sections • 268 lectures • 86h 16m total length
            </div>
            <div className="space-y-4">
              {courseData.courseContent.map((section, index) => (
                <AccordionItem
                  key={index}
                  section={section}
                  isOpen={openSection === index}
                  onClick={() => toggleSection(index)}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar - Pricing and other info (for smaller screens) */}
          <div className="lg:hidden mt-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              {/* ... The same pricing box content as above ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
