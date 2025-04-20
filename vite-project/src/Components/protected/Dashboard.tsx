import { FaArrowUp } from "react-icons/fa";
import DashboardCard from "./DashboardCard";
import { IoBarChartSharp } from "react-icons/io5";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-9 p-16">
      <h1 className="text-3xl text-slate-600 font-semibold ps-2">Overview</h1>
      <div className="flex gap-12">
        <DashboardCard
          primaryicon={<IoBarChartSharp color="purple" size={30} />}
          secondaryicon={<FaArrowUp />}
          title={"Total Revenue"}
          price={200}
        />
        <DashboardCard
          primaryicon={<IoBarChartSharp color="purple" size={30} />}
          secondaryicon={<FaArrowUp />}
          title={"Total Revenue"}
          price={200}
        />
        <DashboardCard
          primaryicon={<IoBarChartSharp color="purple" size={30} />}
          secondaryicon={<FaArrowUp />}
          title={"Total Revenue"}
          price={200}
        />
        <DashboardCard
          primaryicon={<IoBarChartSharp color="purple" size={30} />}
          secondaryicon={<FaArrowUp />}
          title={"Total Revenue"}
          price={200}
        />
      </div>
    </div>
  );
};

export default Dashboard;
