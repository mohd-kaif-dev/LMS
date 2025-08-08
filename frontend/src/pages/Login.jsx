import { useState } from "react";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        formData,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      setIsGoogleLogin(true);
      setIsLoading(true);
      const googleLoginURL = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/auth/google`;
      window.location.href = googleLoginURL;
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is already logged in
  const userData = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (userData) {
        if (isGoogleLogin) {
          navigate("/success-login");
        } else {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    };

    checkLoginStatus();
  }, [navigate, userData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Didn&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-gray-500">OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full mt-4 border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-100 transition"
        >
          <FaGoogle />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
