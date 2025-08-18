import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-8">
      <div className="container mx-auto px-4">
        {/* Top Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Work With Us */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Work With Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Affiliate Program
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Partnerships
                </a>
              </li>
            </ul>
          </div>

          {/* Teach with us */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Teach with us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Become a Teacher
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Teacher Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Teacher Rules & Requirements
                </a>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Gift Memberships
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Digital Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  1-on-1 Sessions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Live Sessions
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Mobile</h3>
            <div className="space-y-4">
              <a href="#" className="block">
                <img
                  src="https://placehold.co/150x50/000000/ffffff?text=App+Store"
                  alt="Download on the App Store"
                  className="rounded-lg"
                />
              </a>
              <a href="#" className="block">
                <img
                  src="https://placehold.co/150x50/000000/ffffff?text=Google+Play"
                  alt="Get it on Google Play"
                  className="rounded-lg"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Socials, Copyright, and Language */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm">
            <span>&copy; LearnSphere, Inc. 2025</span>
            <a href="#" className="hover:text-white">
              Help
            </a>
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Your Privacy Choices
            </a>
            <span className="hidden md:block">&#x2022;</span>
            <a href="#" className="hover:text-white">
              Notice to CA Residents
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a href="#" aria-label="Instagram" className="hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white">
                <FaLinkedin size={20} />
              </a>
              <a href="#" aria-label="Pinterest" className="hover:text-white">
                <FaPinterest size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white">
                <FaYoutube size={20} />
              </a>
            </div>

            {/* Language Dropdown (static for now) */}
            <div className="relative">
              <select className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
