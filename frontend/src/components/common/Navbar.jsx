import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";

import { useAuthStore } from "../../store/useAuthStore";
import { Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isBrowseDropdownOpen, setIsBrowseDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { authUser, logout, updateRole } = useAuthStore();
  const navigate = useNavigate();

  // Create refs for each dropdown
  const browseDropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Data for the dropdown menu
  const categories = [
    "AI & Innovation",
    "Animation & 3D",
    "Art & Illustration",
    "Crafts & DIY",
    "Creative Career",
    "Creativity & Inspiration",
    "Design",
    "Development",
    "Film & Video",
    "Home & Lifestyle",
    "Marketing & Business",
    "Music & Audio",
    "Personal Development",
    "Photography",
    "Productivity",
    "Writing & Publishing",
  ];

  const contentTypes = [
    "All Classes",
    "All Learning Paths",
    "All Student Projects",
  ];
  const shopItems = ["Digital Products", "1-on-1 Sessions", "Live Sessions"];
  const exploreItems = ["Blog"];

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  const handleUpdateRole = () => {
    const role = "instructor";
    updateRole(role);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close browse dropdown
      if (
        browseDropdownRef.current &&
        !browseDropdownRef.current.contains(event.target)
      ) {
        setIsBrowseDropdownOpen(false);
      }
      // Close search dropdown
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setIsSearchDropdownOpen(false);
      }
      // Close profile dropdown
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-2 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo and Browse */}
          <div className="flex items-center space-x-8">
            <NavLink
              to="/"
              className="font-bold flex flex-col font-mono -space-y-3 text-2xl text-gray-800"
            >
              <span className="text-blue-500">Learn•</span>
              <span className="uppercase">Sphere</span>
            </NavLink>

            {/* Desktop Browse link with Dropdown */}
            <div
              className="relative hidden md:block
            "
              ref={browseDropdownRef}
            >
              <button
                onClick={() => setIsBrowseDropdownOpen(!isBrowseDropdownOpen)}
                className="flex items-center text-gray-700 text-lg hover:text-gray-900 transition-colors duration-200 focus:outline-none"
              >
                Browse{" "}
                {!isBrowseDropdownOpen ? (
                  <FaChevronDown size={16} className="ml-1" />
                ) : (
                  <FaChevronUp size={16} className="ml-1" />
                )}
              </button>

              {/* Dropdown Menu */}
              {isBrowseDropdownOpen && (
                <div className="absolute top-full left-0 right-0 w-[500px] mt-3  bg-white rounded-lg shadow-xl z-20 p-6">
                  {/* Classes by Category */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                      Classes by Category
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <NavLink
                          key={category}
                          to={`/category/${category
                            .toLowerCase()
                            .replace(/ & /g, "-")
                            .replace(/ /g, "-")}`}
                          className="text-gray-700 hover:text-blue-500 transition-colors duration-200 text-sm"
                        >
                          {category}
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  <hr className="my-4 h-0.5 bg-blue-500" />

                  {/* By Content Type */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                      By Content Type
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {contentTypes.map((type) => (
                        <NavLink
                          key={type}
                          to={`/type/${type.toLowerCase().replace(/ /g, "-")}`}
                          className="text-gray-700 hover:text-blue-500 transition-colors duration-200 text-sm"
                        >
                          {type}
                        </NavLink>
                      ))}
                    </div>
                  </div>

                  <hr className="my-4  h-0.5 bg-blue-500" />

                  {/* Shop & Explore */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {/* Shop */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                        Shop
                      </h3>
                      {shopItems.map((item) => (
                        <NavLink
                          key={item}
                          to={`/shop/${item.toLowerCase().replace(/ /g, "-")}`}
                          className="block text-gray-700 hover:text-blue-500 transition-colors duration-200 text-sm"
                        >
                          {item}
                        </NavLink>
                      ))}
                    </div>

                    {/* Explore */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                        Explore
                      </h3>
                      {exploreItems.map((item) => (
                        <NavLink
                          key={item}
                          to={`/explore/${item.toLowerCase()}`}
                          className="block text-gray-700 hover:text-blue-500 transition-colors duration-200 text-sm"
                        >
                          {item}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Section: Search Bar */}
          <SearchBar
            isSearchDropdownOpen={isSearchDropdownOpen}
            setIsSearchDropdownOpen={setIsSearchDropdownOpen}
            searchDropdownRef={searchDropdownRef}
          />

          {/* Right Section: Sign In & Sign Up buttons */}
          <div className="flex items-center space-x-4">
            {/* Desktop buttons */}
            {authUser ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleUpdateRole}
                  className="bg-blue-500 text-white text-sm font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md"
                >
                  Instructor Dashboard
                </button>

                <NavLink to="/student/my-enrollments">
                  <div>
                    <span className="mr-4">|</span>My Enrollments
                  </div>
                </NavLink>

                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className={`
                    flex items-center justify-center focus:outline-none 
                    ${isProfileDropdownOpen && "ring-2 ring-black"}
                    rounded-full
                  `}
                  >
                    <img
                      src={authUser.profilePicture || "/avatar.webp"}
                      alt={authUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>
                </div>

                <div
                  ref={profileDropdownRef}
                  className={`
                          absolute top-full right-5 mt-2 w-56 p-2 bg-white rounded-xl shadow-xl ring-1 ring-gray-200
                          transform origin-top transition-all duration-300
                          ease-in-out
                          focus:outline-none z-10 scale-0 opacity-0
                          ${
                            isProfileDropdownOpen
                              ? "scale-100 opacity-100 translate-y-0"
                              : "-translate-y-5"
                          }`}
                >
                  <div className="flex flex-col space-y-2">
                    <NavLink
                      to="/student/dashboard"
                      className="
                            flex items-center p-3 rounded-lg
                            text-gray-700 hover:bg-gray-200
                            transition-all duration-300 ease-out
                            text-sm font-medium
                          "
                    >
                      <span className="ml-2">Student Dashboard</span>
                    </NavLink>

                    <NavLink
                      to="/student/profile"
                      className="
                            flex items-center p-3 rounded-lg
                            text-gray-700 hover:bg-gray-200
                            transition-all duration-300 ease-out
                            text-sm font-medium
                          "
                    >
                      <span className="ml-2">Profile</span>
                    </NavLink>

                    <div className="border-t border-gray-100 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="
                              flex items-center p-3 rounded-lg
                              text-red-500 hover:bg-red-100 hover:text-red-600
                              transition-all duration-300 ease-out
                              text-sm font-medium
                            "
                    >
                      <span className="ml-2">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <NavLink
                  to="/sign-in"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/sign-up"
                  className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (collapsible) */}
        <div
          className={`md:hidden mt-4 absolute inset-x-0 bg-white shadow-md z-50 p-4 transition-transform duration-300 ease-in-out ${
            isMenuOpen
              ? "translate-y-0 opacity-1"
              : "-translate-y-[200%] opacity-0"
          }`}
        >
          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search classes..."
              className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setIsBrowseDropdownOpen(!isBrowseDropdownOpen)}
            className="flex items-center justify-between w-full py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            Browse <FaChevronDown size={16} />
          </button>
          {isBrowseDropdownOpen && (
            <div className="pl-4 pt-2 pb-2">
              {/* Mobile dropdown content (simplified for brevity) */}
              <h3 className="text-sm font-bold text-gray-500 uppercase mt-2 mb-1">
                Classes by Category
              </h3>
              <div className="flex flex-col space-y-1">
                {categories.map((category) => (
                  <NavLink
                    key={category}
                    to={`/category/${category
                      .toLowerCase()
                      .replace(/ & /g, "-")
                      .replace(/ /g, "-")}`}
                    className="text-gray-700 hover:text-blue-500 text-sm"
                  >
                    {category}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
          <hr className="my-4" />
          {authUser ? (
            <div className="flex items-center space-x-4">
              <NavLink to={`/instructor/dashboard`}>
                <button
                  onClick={handleUpdateRole}
                  className="bg-blue-500 text-white text-sm font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md"
                >
                  Instructor Dashboard
                </button>
              </NavLink>

              <NavLink to="/student/my-enrollments">
                <div>
                  <span className="mr-4">|</span>My Enrollments
                </div>
              </NavLink>

              {/* <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className={`
                    flex items-center justify-center focus:outline-none 
                    ${isProfileDropdownOpen && "ring-2 ring-black"}
                    rounded-full
                  `}
                  >
                    <img
                      src={authUser.profilePicture || "/avatar.webp"}
                      alt={authUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>
                </div> */}

              <div
                className={`
                          absolute top-full right-5 mt-2 w-56 p-2 bg-white rounded-xl shadow-xl ring-1 ring-gray-200
                          transform origin-top transition-all duration-300
                          ease-in-out
                          focus:outline-none `}
              >
                <div className="flex flex-col space-y-2">
                  <NavLink
                    to="/student/dashboard"
                    className="
                            flex items-center p-3 rounded-lg
                            text-gray-700 hover:bg-gray-200
                            transition-all duration-300 ease-out
                            text-sm font-medium
                          "
                  >
                    <span className="ml-2">Student Dashboard</span>
                  </NavLink>

                  <NavLink
                    to="/student/profile"
                    className="
                            flex items-center p-3 rounded-lg
                            text-gray-700 hover:bg-gray-200
                            transition-all duration-300 ease-out
                            text-sm font-medium
                          "
                  >
                    <span className="ml-2">Profile</span>
                  </NavLink>

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="
                              flex items-center p-3 rounded-lg
                              text-red-500 hover:bg-red-100 hover:text-red-600
                              transition-all duration-300 ease-out
                              text-sm font-medium
                            "
                  >
                    <span className="ml-2">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/sign-in"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/sign-up"
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
