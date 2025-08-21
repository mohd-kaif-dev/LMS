import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useState } from "react";

const UserLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useEffect(() => {
  //   if (authUser.role !== "student") {
  //     navigate("/instructor/dashboard");
  //   }
  // });

  return (
    <div className=" relative">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      {isMenuOpen && (
        <div className="md:hidden absolute inset-0 bg-black opacity-50 z-40" />
      )}
    </div>
  );
};

export default UserLayout;
