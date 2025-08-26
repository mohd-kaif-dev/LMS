import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const UserLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // if (!authUser) {
    //   navigate("/sign-in");
    // }
    if (authUser?.role === "instructor") {
      navigate("/instructor/dashboard");
    } else if (authUser?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [authUser, navigate]);

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
