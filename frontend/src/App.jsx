import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// pages
import Home from "./pages/Home";
import SuccessLogin from "./pages/SuccessLogin";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CartPage from "./pages/CartPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import PurchaseFailure from "./pages/PurchaseFailure";
import CategoryDisplay from "./pages/Category";
import VideoPlayerPage from "./pages/VideoPlayer";

// layout
import AdminLayout from "./layout/adminLayout";
import InstructorLayout from "./layout/instructorLayout";
import UserLayout from "./layout/userLayout";

// student
import Dashboard from "./components/students/Dashboard";
import MyEnrollement from "./components/students/MyEnrollment";
import StudentProfile from "./components/students/Profile";

// instructor
import InstructorDashboard from "./components/instructor/Dashboard";
import CourseCreation from "./components/instructor/CourseCreation3";
import MyCourses from "./components/instructor/MyCourses";
import InstructorAnalytics from "./components/instructor/Analytics";
import InstructorProfile from "./components/instructor/Profile";

import CourseDetails from "./components/user/CourseDetails";

// admin
import AdminDashboard from "./components/admin/AdminDashboard";
import UserManagement from "./components/admin/UserManagement";
import CourseManagement from "./components/admin/CourseManagement";
import Settings from "./components/admin/Settings";
import AdminAnalytics from "./components/admin/AdminAnalytics";

const App = () => {
  return (
    <div className="montserrat-regular">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="success-login" element={<SuccessLogin />} />
          <Route path="student/dashboard" element={<Dashboard />} />
          <Route path="student/my-enrollments" element={<MyEnrollement />} />
          <Route path="courses/:title" element={<CourseDetails />} />
          <Route path="student/profile" element={<StudentProfile />} />
          <Route path="cart/:title" element={<CartPage />} />
          <Route path="purchase-success" element={<OrderConfirmation />} />
          <Route path="purchase-failure" element={<PurchaseFailure />} />
          <Route path="category/:category" element={<CategoryDisplay />} />
          <Route
            path="courses/:title/learn/:lessonId"
            element={<VideoPlayerPage />}
          />
        </Route>
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="course-creation" element={<CourseCreation />} />
          <Route path="edit-course/:courseId" element={<CourseCreation />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="my-courses/:title/view" element={<CourseDetails />} />
          <Route path="analytics" element={<InstructorAnalytics />} />
          <Route path="profile" element={<InstructorProfile />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-users" element={<UserManagement />} />
          <Route path="manage-courses" element={<CourseManagement />} />
          <Route path="courses/:title/view" element={<CourseDetails />} />
          <Route path="site-analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
