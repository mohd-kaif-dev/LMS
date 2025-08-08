import axios from "axios";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SuccessLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const fetchUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      console.log("Token from URL:", token);
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Logging you in...
        </h2>
        <p className="text-lg text-gray-600">
          Please wait a moment while we finalize your login.
        </p>
      </div>
    </div>
  );
};

export default SuccessLogin;
