import React from "react";

import blueWave from "../../assets/bg-wave2.svg?react"; // Assuming you have a blueWave component for the background

import ModernCard from "../../utils/Pattern";
import { useAuthStore } from "../../store/useAuthStore";

// Inline SVG for the wave to avoid external image dependencies
const Hero = () => {
  const { authUser } = useAuthStore();
  return (
    <section className="relative bg-gray-100 overflow-hidden">
      {/* Background SVG wave for visual flair */}
      <div className="absolute inset-x-0 w-full">
        <img
          src={blueWave}
          alt="blue wave background"
          className="w-full h-full object-contain"
        />
      </div>

      <div className=" px-4 relative z-10 flex flex-col md:flex-row items-center justify-between h-[500px]">
        {/* Left Section: Main Heading */}
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 px-8">
          <h1 className="text-3xl md:text-5xl leading-tight text-gray-900 michroma-regular">
            Creative Classes Taught by the Best Creative Pros
          </h1>
        </div>

        {/* Right Section: Sign-up Box */}
        <div className="absolute top-0 right-0 flex justify-center md:justify-end">
          {!authUser ? (
            <ModernCard
              title="Ready to Start Your Journey?"
              description="Unlock your potential with thousands of creative classes taught by experts. Join our community and learn something new today."
              buttonText="Get Started"
              path="/sign-up"
            />
          ) : (
            <ModernCard
              title="Welcome Back!"
              description="Keep exploring new classes and expanding your knowledge. We're glad to have you back!"
              buttonText="Continue Learning"
              path="/student/my-enrollments"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
