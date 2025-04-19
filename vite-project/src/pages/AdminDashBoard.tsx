// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const AdminDashBoard = () => {
  const [dashboardData, setDashboardData] = useState<string>();
  //   const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }
  const { userData } = authContext;

  async function getDashDetails() {
    const { data } = await axios.get(`http://localhost:3000/admin/dashboard`);
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
    //if the role has been tampered with in the frontend , verify it once from the backend using the api call.
    return (
      <div>
        <span>{dashboardData}</span>
      </div>
    );
  }
};

export default AdminDashBoard;
