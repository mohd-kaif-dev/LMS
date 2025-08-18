import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const SuccessLogin = () => {
  const navigate = useNavigate();
  const { getUser } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in
    const fetchUser = async () => {
      console.log("Fetching User");
      const { success } = await getUser();
      console.log("success", success);
      if (success) {
        navigate("/student/dashboard");
      }
    };

    fetchUser();
  }, [navigate, getUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Logging you in...
        </h2>
        <div className="w-full mb-4 grid grid-cols-3">
          <div className="col-span-1 relative">
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2 h-16 w-16 animate-pulse"></div>
          </div>
          <div className="col-span-1 relative">
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2 h-12 w-12 animate-pulse"></div>
          </div>
          <div className="col-span-1 relative">
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-gray-200 rounded-full -translate-x-1/2 -translate-y-1/2 h-8 w-8 animate-pulse"></div>
          </div>
        </div>
        <p className="text-lg text-gray-600">
          Finalizing your login, please wait...
        </p>
      </div>
    </div>
  );
};

export default SuccessLogin;
