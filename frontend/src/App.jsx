import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SuccessLogin from "./pages/SuccessLogin";
import Register from "./pages/Register";
import InstructorDashboard from "./components/InstructorDashboard";
import Layout from "./components/Layout";
import CourseCreation from "./components/CourseCreation";
import CourseDetailsPage from "./components/CourseDetailPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success-login" element={<SuccessLogin />} />
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />
        </Route>
        <Route path="/course-creation" element={<CourseCreation />} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
