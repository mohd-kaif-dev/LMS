import { useEffect, useState } from "react";

import CourseCard from "./CourseCard";
// import CourseImage1 from "../../assets/CourseImage1.webp";
// import CourseImage2 from "../../assets/CourseImage2.webp";
// import CourseImage3 from "../../assets/CourseImage3.webp";
// import CourseImage4 from "../../assets/CourseImage4.webp";
import useCourseStore from "../../store/useCourseStore";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Featured", slug: "featured" },
  { name: "Web Design", slug: "web-design" },
  { name: "Music", slug: "music" },
  { name: "Drawing & Painting", slug: "drawing-painting" },
  { name: "Animation", slug: "animation" },
  { name: "Social Media", slug: "social-media" },
  { name: "Art & Illustration", slug: "art" },
  { name: "Coding Development", slug: "coding-development" },
  { name: "UI/UX Design", slug: "ui-ux" },
  { name: "Creative Writing", slug: "creative-writing" },
  { name: "Digital Illustration", slug: "digital-illustration" },
  { name: "Business", slug: "business" },
  { name: "Film & Video", slug: "film-video" },
  { name: "Web Development", slug: "web-devlopment" },
  { name: "Freelance & Entrepreneurship", slug: "freelance" },
  { name: "Graphic Design", slug: "graphic-design" },
  { name: "Photography", slug: "photography" },
];

// // Mock data for the courses
// const mockCourses = [
//   {
//     id: 1,
//     title:
//       "Kickstart your creativity with Procreate: 20 Fun Drawings for Beginners and Beyond",
//     author: "Lisa Bardot",
//     imageUrl: CourseImage1,
//     isStaffPick: true,
//     rating: 4.8,
//     students: "20,314",
//     duration: "6h 24m",
//   },
//   {
//     id: 2,
//     title: "Social Media Content Creation in Canva: From Beginner to Advanced",
//     author: "Maggie Stara",
//     imageUrl: CourseImage2,
//     isStaffPick: true,
//     rating: 4.9,
//     students: "40,130",
//     duration: "13h 19m",
//   },
//   {
//     id: 3,
//     title: "Landscapes: A Free-Flow Watercolour Masterclass with Jane Davies",
//     author: "Jane Davies",
//     imageUrl: CourseImage3,
//     isStaffPick: false,
//     rating: 4.7,
//     students: "1,820",
//     duration: "1h 42m",
//   },
//   {
//     id: 4,
//     title: "Figma UI UX Design Advanced: Become a Figma Pro",
//     author: "Daniel Scott",
//     imageUrl: CourseImage4,
//     isStaffPick: true,
//     rating: 4.9,
//     students: "5,550",
//     duration: "16h 8m",
//   },
// ];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const navigate = useNavigate();
  const { courses, fetchCourses, isFetching } = useCourseStore();

  const filteredCourses = courses.filter(
    (course) => course.category === activeTab
  );

  useEffect(() => {
    fetchCourses({ category: activeTab, limit: 4 });
  }, [fetchCourses, activeTab]);

  return (
    <section className="bg-black text-white p-2 md:p-8 ld:p-16 rounded-xl">
      <div className="container mx-auto px-0 md:px-8 flex flex-col">
        {/* Section Header */}
        <h2 className="text-4xl mb-8 text-center michroma-regular">
          Explore Inspiring Online Courses
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveTab(category.slug)}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200 ${
                activeTab === category.slug
                  ? "bg-blue-500 text-black"
                  : "bg-transparent text-white border border-white/70 hover:bg-gray-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate(`/category/${activeTab}`)}
          className="text-sm font-semibold px-4 py-2 rounded-xl border border-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 self-end mb-4"
        >
          View All
        </button>

        {/* Course Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
          {!isFetching ? (
            filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div className="col-span-4 text-center my-16">
                No Courses Found!!
              </div>
            )
          ) : (
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="w-full h-64 bg-gray-500 animate-pulse rounded-lg"
              ></div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryTabs;
