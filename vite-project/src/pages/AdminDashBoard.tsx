// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../Components/protected/SideBar";
import NavBar from "../Components/NavBar";
const AdminDashBoard = () => {
  const [dashboardData, setDashboardData] = useState<string>();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }
  const { userData } = authContext;

  async function getDashDetails() {
    const { data } = await axios.get(
      `http://localhost:3000/api/admin/dashboard`
    );
    console.log(data);
    setDashboardData(data.message);
  }
  useEffect(() => {
    getDashDetails();
  });

  if (userData?.role != "admin") {
    //check if the role is admin.
    return <Navigate to={"/login"}></Navigate>;
  } else {
    return (
      <div className="flex">
        <SideBar />
        <div className="flex-1 flex flex-col justify-between">
          <NavBar page="notHome"></NavBar>
          <main>
            <span>{dashboardData}</span>
            <Outlet />
          </main>
        </div>
      </div>
    );
  }
};

export default AdminDashBoard;
