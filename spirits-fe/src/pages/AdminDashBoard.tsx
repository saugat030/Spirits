// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../components/protected/SideBar";
import NavBar from "../components/NavBar";
import { ClipLoader } from "react-spinners";

const AdminDashBoard = () => {
  const [dashboardData, setDashboardData] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  console.log(dashboardData);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }
  const { userData } = authContext;

  async function getDashDetails() {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`
    );
    setDashboardData(data.message);
    setLoading(false);
  }

  useEffect(() => {
    getDashDetails();
  }, []);

  if (!userData) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <ClipLoader color="brown" size={100} />
      </div>
    );
  }
  if (userData.role != "admin") {
    return <Navigate to={"/login"}></Navigate>;
  } else {
    if (loading) {
      return (
        <div className="h-screen w-screen flex justify-center items-center">
          <ClipLoader color="brown" size={100} />
        </div>
      );
    }
    return (
      <div className="flex font-Poppins">
        <SideBar />
        <div className="flex-1 flex flex-col justify-between">
          <NavBar page="notHome"></NavBar>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
};

export default AdminDashBoard;
