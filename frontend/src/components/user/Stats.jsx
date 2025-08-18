import { FaCheck, FaStar as StarIcon } from "react-icons/fa";

const Stats = () => {
  return (
    <section className="bg-black text-white py-16 px-4 font-sans">
      <div className="container mx-auto">
        {/* Top Section: Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8 mb-16">
          {/* Left: Main Heading */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl  leading-tight michroma-regular">
              Creative Learning Made Easy
            </h1>
          </div>

          {/* Right: Bulleted List */}
          <div className="w-full md:w-1/2">
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <FaCheck className="text-blue-500 w-6 h-6 mt-1 mr-2 flex-shrink-0" />
                <span>Thousands of creative classes. Beginner to pro.</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-500 w-6 h-6 mt-1 mr-2 flex-shrink-0" />
                <span>Taught by creative pros and industry icons.</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-500 w-6 h-6 mt-1 mr-2 flex-shrink-0" />
                <span>Learning Paths to help you achieve your goals.</span>
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-500 w-6 h-6 mt-1 mr-2 flex-shrink-0" />
                <span>Certificates to celebrate your accomplishments.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Members */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-4xl font-bold text-blue-500">425k+</p>
            <p className="text-sm uppercase font-semibold tracking-wide text-gray-400 mt-2">
              MEMBERS
            </p>
          </div>

          {/* Classes */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-4xl font-bold">30k+</p>
            <p className="text-sm uppercase font-semibold tracking-wide text-gray-400 mt-2">
              CLASSES
            </p>
          </div>

          {/* Teachers */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <p className="text-4xl font-bold">9k+</p>
            <p className="text-sm uppercase font-semibold tracking-wide text-gray-400 mt-2">
              TEACHERS
            </p>
          </div>

          {/* App Store Rating */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
            <div className="flex items-center justify-center space-x-1 text-blue-500">
              <p className="text-4xl font-bold">4.8</p>
              <div className="flex">
                <StarIcon fill="currentColor" />
                <StarIcon fill="currentColor" />
                <StarIcon fill="currentColor" />
                <StarIcon fill="currentColor" />
                <StarIcon fill="currentColor" />
              </div>
            </div>
            <p className="text-sm uppercase font-semibold tracking-wide text-gray-400 mt-2">
              APP STORE RATING
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
