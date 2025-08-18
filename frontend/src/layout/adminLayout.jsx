import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  //   const navigate = useNavigate();

  //   const { authUser } = useAuthStore();
  //   // const isInstructorUrl = window.location.href.includes("/instructor");

  //   useEffect(() => {
  //     if (!authUser) {
  //       navigate("/sign-in");
  //     }
  //   }, [authUser, navigate]);

  // useEffect(() => {
  //   if (authUser.role !== "instructor") {
  //     navigate("/student/dashboard");
  //   }
  // });

  return (
    <div className="montserrat-regular w-full flex ">
      <AdminSidebar />
      <main className="min-h-screen w-4/5">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
