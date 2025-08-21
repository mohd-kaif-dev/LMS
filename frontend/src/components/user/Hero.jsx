import blueBlock from "../../assets/bg-wave2.svg?react";

import ModernCard from "../../utils/ModernCard";
import { useAuthStore } from "../../store/useAuthStore";

const Hero = () => {
  const authUser = useAuthStore((state) => state.authUser);
  return (
    <section className="relative bg-gray-100 overflow-hidden">
      {/* Background SVG for visual flair */}
      <div className="absolute inset-x-0 w-full">
        <img
          src={blueBlock}
          alt="blue block background"
          className="w-full h-full object-contain"
        />
      </div>

      <div className=" px-4 relative z-10 flex flex-col md:flex-row md:items-center md:h-[500px]">
        {/* Left Section: Main Heading */}
        <div className="md:w-1/2 text-center md:text-left m-8 md:m-0 p-8 ">
          <h1 className="text-3xl md:text-5xl leading-tight text-gray-900 michroma-regular">
            Creative Classes Taught by the Best Creative Pros
          </h1>
        </div>

        {/* Right Section: Sign-up Box */}
        <div className="relative md:absolute md:top-20 md:right-5 flex justify-center">
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
