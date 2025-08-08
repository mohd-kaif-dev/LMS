import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isAuthenticated = token && storedUser;

  const handleBecomeInstructor = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      let res;
      if (storedUser.role !== "instructor") {
        res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/update-role`,
          { role: "instructor" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/instructor/dashboard");
      } else {
        res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/update-role`,
          { role: "student" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate("/");
      }
      console.log("Response:", res.data);
      // Update localStorage with new role
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          role: res.data.user.role,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  //   useEffect(() => {
  //     const checkUserRole = () => {
  //       if (isAuthenticated && storedUser.role === "instructor") {
  //         navigate("/instructor/dashboard");
  //       } else {
  //         navigate("/");
  //       }
  //     };
  //     checkUserRole();
  //   }, [isAuthenticated, storedUser.role, navigate]);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-xl font-bold tracking-wide">
        LMS
      </Link>

      <div className="flex gap-4 items-center">
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition"
            >
              Sign Up
            </Link>
            <button
              onClick={handleBecomeInstructor}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md transition"
            >
              Become Instructor
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleBecomeInstructor}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md transition"
            >
              {storedUser.role === "instructor" ? "Student" : "Instructor"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
