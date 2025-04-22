import DashboardCard from "./DashboardCard";
import { FaArrowUp } from "react-icons/fa";
import { IoBarChartSharp } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { RiBox3Line } from "react-icons/ri";
import { GiWineBottle } from "react-icons/gi";
const DashboardOverview = () => {
  return (
    <>
      <h1 className="text-3xl text-slate-600 font-semibold ps-12 w-full">
        Overview
      </h1>
      <div className="flex gap-12">
        <DashboardCard
          primaryicon={<IoBarChartSharp color="purple" size={30} />}
          secondaryicon={<FaArrowUp />}
          title={"Total Revenue"}
          price={432}
        />
        <DashboardCard
          primaryicon={<GiWineBottle color="brown" size={30} />}
          secondaryicon={<FaArrowUp />}
          title={"Total Products"}
          price={56}
        />
        <DashboardCard
          primaryicon={<FiUsers color="orange" size={30} />}
          secondaryicon={<FaArrowUp />}
          title={"Total Users"}
          price={20}
        />
        <DashboardCard
          primaryicon={<RiBox3Line color="gray" size={30} />}
          secondaryicon={<FaArrowUp />}
          title={"Total Orders"}
          price={42}
        />
      </div>
    </>
  );
};

export default DashboardOverview;
