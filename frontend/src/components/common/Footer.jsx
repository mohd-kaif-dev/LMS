import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
} from "lucide-react";

// ======================================================================
// Enhanced Footer Component
// ======================================================================
const Footer = () => {
  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
    { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
    { icon: <Youtube size={20} />, href: "#", label: "YouTube" },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Blog"],
    },
    {
      title: "Platform",
      links: [
        "Browse Courses",
        "Become an Instructor",
        "Affiliate Program",
        "Partnerships",
      ],
    },
    {
      title: "Support",
      links: [
        "Contact Us",
        "Help Center",
        "Privacy Policy",
        "Terms of Service",
      ],
    },
  ];

  return (
    <footer className="bg-slate-900/80 backdrop-blur-lg text-slate-300 border-t border-slate-700/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-white">LearnSphere</h2>
            <p className="text-sm text-slate-400">
              Empowering minds through accessible, engaging, and high-quality
              online education.
            </p>
            <div>
              <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-l-md px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white hover:underline transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} LearnSphere, Inc. All Rights
            Reserved.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-slate-500 hover:text-white transition-transform hover:scale-110"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
