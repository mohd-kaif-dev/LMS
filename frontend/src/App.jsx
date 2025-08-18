import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SuccessLogin from "./pages/SuccessLogin";
import Register from "./pages/Register";
// import InstructorDashboard from "./components/InstructorDashboard";
import Layout from "./components/Layout";
import CourseCreation from "./components/instructor/CourseCreation";
import CourseDetailsPage from "./components/CourseDetailPage";
import UserLayout from "./layout/userLayout";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
// import { useAuthStore } from "./store/useAuthStore";
// import { useEffect } from "react";
// import { FaSpinner } from "react-icons/fa";
import { Toaster } from "sonner";
import Dashboard from "./components/students/Dashboard";
import InstructorLayout from "./layout/instructorLayout";
import InstructorDashboard from "./components/instructor/Dashboard";
import Analytics from "./components/instructor/Analytics";
import MyCourses from "./components/instructor/MyCourses";
import MyEnrollement from "./components/students/MyEnrollment";
import CourseCreation1 from "./components/CourseCreation1";
import CourseDetails from "./components/user/CourseDetails";

import AdminLayout from "./layout/adminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";
import CourseManagement from "./components/admin/CourseManagement";
import Settings from "./components/admin/Settings";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import InstructorAnalytics from "./components/instructor/Analytics";
import InstructorProfile from "./components/instructor/Profile";
import StudentProfile from "./components/students/Profile";

const App = () => {
  // const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  // if (isCheckingAuth) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <FaSpinner size={32} className="animate-spin" />;
  //     </div>
  //   );
  // }

  // console.log("authUser", authUser);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success-login" element={<SuccessLogin />} />

          {/* <Route path="/course/:courseId" element={<CourseDetailsPage />} /> */}
        </Route>
        <Route element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/student/my-enrollments" element={<MyEnrollement />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Route>
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="course-creation" element={<CourseCreation />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="analytics" element={<InstructorAnalytics />} />
          <Route path="profile" element={<InstructorProfile />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-users" element={<UserManagement />} />
          <Route path="manage-courses" element={<CourseManagement />} />
          <Route path="site-analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
