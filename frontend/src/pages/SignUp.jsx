import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import ImagePattern from "../utils/ImagePattern";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { authUser, signup, isSigningUp, googleSignIn } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log("Signing up with:", formData);
    const { success } = await signup(formData);
    if (success) {
      navigate("/student/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Signing with Google");
    await googleSignIn();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (authUser) {
      navigate("/student/dashboard");
    }
  });

  return (
    <div className="w-full flex">
      <div className="hidden md:block md:w-1/2">
        <ImagePattern
          title="Join our community"
          subtitle="LearnSphere is a place for learning and sharing knowledge."
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Welcome
          </h1>
          <p className="text-gray-600 text-center mb-8 text-lg font-semibold">
            Sign Up to <span className="text-green-500">Learn</span>Sphere
          </p>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Full Name Input */}
            <div className="relative group">
              <label
                className={`absolute inset-y-2 left-2 flex items-center pl-3 text-gray-500 transition-transform duration-300 ease-in-out z-10 bg-white group-active:-translate-y-8 group-focus-within:-translate-y-8 ${
                  formData.fullName && "-translate-y-8"
                }`}
                htmlFor="fullName"
              >
                Full Name*
              </label>
              <input
                type="fullName"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {/* Email Input */}
            <div className="relative group">
              <label
                className={`absolute inset-y-2 left-2 flex items-center pl-3 text-gray-500 transition-transform duration-300 ease-in-out z-10 bg-white group-active:-translate-y-8 group-focus-within:-translate-y-8 ${
                  formData.email && "-translate-y-8"
                }`}
                htmlFor="email"
              >
                Email address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <label
                className={`absolute inset-y-2 left-2 flex items-center pl-3 text-gray-500 transition-transform duration-300 ease-in-out z-10 bg-white group-active:-translate-y-8 group-focus-within:-translate-y-8 ${
                  formData.password && "-translate-y-8"
                }`}
                htmlFor="password"
              >
                Password*
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full flex items-start justify-center bg-green-500 text-white font-semibold rounded-lg py-3 px-6  hover:bg-green-600 transition-colors duration-200 shadow-md"
            >
              {isSigningUp ? (
                <FaSpinner size={20} className="animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:underline font-medium"
            >
              Log in
            </a>
          </p>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-2 bg-white text-gray-800 py-3 px-6 rounded-full border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Inline SVG for Google icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.92 2.92 30.45 0 24 0 14.62 0 6.54 5.38 2.53 13.25l7.98 6.19C12.43 13.72 17.75 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.7 24c0-1.57-.15-3.09-.4-4.57H24v9.14h12.43c-.53 2.92-2.18 5.61-4.18 7.42l6.85 5.3c3.9-3.6 6.22-8.5 6.22-14.3z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.53l-7.98-6.19C1.86 24.58 1 27.27 1 30.1c0 3.73.83 7.3 2.5 10.37l7.85-6.1z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.96-2.13 15.96-5.86l-6.85-5.3c-2.4 1.7-5.59 2.8-9.11 2.8-6.27 0-11.59-4.22-13.47-9.91l-7.85 6.1C6.54 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
            By signing up you agree to LearnSphere's{" "}
            <a href="#" className="underline hover:text-gray-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-700">
              Privacy Policy
            </a>
            . This page is protected by reCAPTCHA and is subject to Google's{" "}
            <a href="#" className="underline hover:text-gray-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-700">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
