import SearchBar from "./SearchBar";
import FeaturedCourses from "./DashboardCourses";
import CategoryTabs from "../user/CategoryTabs";
import PopularCourses from "./PopularCourses";
import TrendingCourses from "./TrendingCourses";
import CoursesByTopEducators from "./CoursesByTopEducators";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardCourses from "./DashboardCourses";

// // ======================================================================
// // CoursesByCategory.jsx - Using the previously built CategoryTab logic
// // ======================================================================
// const CourseByCategory = () => {
//   const [activeTab, setActiveTab] = useState("featured");

//   const categories = [
//     { name: "Featured", slug: "featured" },
//     { name: "UI/UX Design", slug: "ui-ux" },
//     { name: "Photography", slug: "photography" },
//     { name: "Music", slug: "music" },
//     { name: "Marketing", slug: "marketing" },
//   ];

//   const mockCourses = [
//     {
//       _id: 1,
//       title: "Kickstart your creativity with Procreate",
//       instructor: "Lisa Bardot",
//       imageUrl:
//         "https://placehold.co/400x250/1F2937/ffffff?text=Category+Course+1",
//       isStaffPick: true,
//       rating: 4.8,
//       students: "20,314",
//       duration: "6h 24m",
//     },
//     {
//       _id: 2,
//       title: "Social Media Content Creation in Canva",
//       instructor: "Maggie Stara",
//       imageUrl:
//         "https://placehold.co/400x250/1F2937/ffffff?text=Category+Course+2",
//       isStaffPick: true,
//       rating: 4.9,
//       students: "40,130",
//       duration: "13h 19m",
//     },
//     {
//       _id: 3,
//       title: "Landscapes: A Free-Flow Watercolour Masterclass",
//       instructor: "Jane Davies",
//       imageUrl:
//         "https://placehold.co/400x250/1F2937/ffffff?text=Category+Course+3",
//       isStaffPick: true,
//       rating: 4.7,
//       students: "1,820",
//       duration: "1h 42m",
//     },
//     {
//       _id: 4,
//       title: "Figma UI UX Design Advanced: Become a Figma Pro",
//       instructor: "Daniel Scott",
//       imageUrl:
//         "https://placehold.co/400x250/1F2937/ffffff?text=Category+Course+4",
//       isStaffPick: true,
//       rating: 4.9,
//       students: "5,550",
//       duration: "16h 8m",
//     },
//   ];

//   return (
//     <div className="mb-12">
//       <h2 className="text-3xl font-bold mb-6 text-white">
//         Courses by Category
//       </h2>
//       <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
//         {categories.map((category) => (
//           <button
//             key={category.slug}
//             onClick={() => setActiveTab(category.slug)}
//             className={`text-sm md:text-base font-semibold px-4 py-2 rounded-full transition-colors duration-200 ${
//               activeTab === category.slug
//                 ? "bg-green-500 text-black"
//                 : "bg-gray-800 text-white hover:bg-gray-700"
//             }`}
//           >
//             {category.name}
//           </button>
//         ))}
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {mockCourses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>
//     </div>
//   );
// };

const Dashboard = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) return navigate("/");
  }, [authUser, navigate]);

  return (
    <div className="min-h-screen  p-8">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12">
          Welcome, {authUser?.name || "User"}
        </h1>
        <SearchBar />
        <DashboardCourses title="Featured Courses" slug="featured" />
        <DashboardCourses title="Popular Courses" slug="music" />
        <DashboardCourses title="Trending Courses" slug="animation" />
        <DashboardCourses title="Courses by Top Educators" slug="ui-ux" />
        <CategoryTabs />
      </div>
    </div>
  );
};

export default Dashboard;
