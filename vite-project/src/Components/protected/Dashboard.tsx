import { FaArrowUp } from "react-icons/fa";
import DashboardCard from "./DashboardCard";
import { IoBarChartSharp } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { RiBox3Line } from "react-icons/ri";
import { GiWineBottle } from "react-icons/gi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const chartData = {
  revenue: [
    { month: "Jan", value: 400 },
    { month: "Feb", value: 550 },
    { month: "Mar", value: 470 },
    { month: "Apr", value: 600 },
    { month: "May", value: 750 },
    { month: "Jun", value: 800 },
    { month: "Jul", value: 850 },
    { month: "Aug", value: 950 },
    { month: "Sep", value: 1000 },
    { month: "Oct", value: 1200 },
    { month: "Nov", value: 1300 },
    { month: "Dec", value: 1400 },
  ],
  orders: [
    { month: "Jan", value: 50 },
    { month: "Feb", value: 65 },
    { month: "Mar", value: 70 },
    { month: "Apr", value: 90 },
    { month: "May", value: 120 },
    { month: "Jun", value: 130 },
    { month: "Jul", value: 140 },
    { month: "Aug", value: 160 },
    { month: "Sep", value: 170 },
    { month: "Oct", value: 180 },
    { month: "Nov", value: 200 },
    { month: "Dec", value: 220 },
  ],
  users: [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 25 },
    { month: "Mar", value: 30 },
    { month: "Apr", value: 40 },
    { month: "May", value: 55 },
    { month: "Jun", value: 60 },
    { month: "Jul", value: 75 },
    { month: "Aug", value: 80 },
    { month: "Sep", value: 90 },
    { month: "Oct", value: 110 },
    { month: "Nov", value: 120 },
    { month: "Dec", value: 130 },
  ],
};

const Dashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState<
    "revenue" | "orders" | "users"
  >("revenue");
  return (
    <div className="flex flex-col gap-9 p-16 items-center">
      <h1 className="text-3xl text-slate-600 font-semibold ps-2">Overview</h1>
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
      <div className="p-16 flex flex-col gap-8 w-full">
        <h1 className="text-3xl font-semibold text-slate-700">Overview</h1>

        <div className="flex items-center gap-3">
          <label htmlFor="metric" className="text-slate-600 font-medium">
            Select Metric:
          </label>
          <select
            id="metric"
            className="border border-slate-300 rounded px-3 py-1"
            value={selectedMetric}
            onChange={(e) =>
              setSelectedMetric(
                e.target.value as "revenue" | "orders" | "users"
              )
            }
          >
            <option value="revenue">Revenue</option>
            <option value="orders">Orders</option>
            <option value="users">New Users</option>
          </select>
        </div>

        <div className="rounded-xl">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData[selectedMetric]}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={
                  selectedMetric === "revenue"
                    ? "#4f46e5"
                    : selectedMetric === "orders"
                    ? "#f59e0b"
                    : "#10b981"
                }
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
