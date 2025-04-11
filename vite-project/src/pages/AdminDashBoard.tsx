// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const AdminDashBoard = () => {
  const [dData, setDData] = useState<string>();
  //   const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }
  const { userData } = authContext;
  async function getDashDetails() {
    const { data } = await axios.get(
      `http://localhost:3000/admin/dashboard-data`
    );
    console.log(data[0]);
    setDData(data[0].message);
  }
  useEffect(() => {
    getDashDetails();
  });

  if (userData?.role == "admin") {
    if (!dData) {
      return (
        <div className="text-5xl">
          Admin role detected in the frontend ..... Loading
        </div>
      );
    }
    return (
      <div>
        Welcome Admin. Here's the admin data: <span>{dData}</span>
      </div>
    );
  } else {
    return <div>Unauthorized</div>;
  }
};

export default AdminDashBoard;
