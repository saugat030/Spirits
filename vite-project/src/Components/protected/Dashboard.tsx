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
import DashboardOverview from "./DashboardOverview";

const chartData = {
  revenue: [
    { month: "Jan", value: 400 },
    { month: "Feb", value: 550 },
    { month: "Mar", value: 470 },
    { month: "Apr", value: 600 },
    { month: "May", value: 750 },
    { month: "Jun", value: 620 },
    { month: "Jul", value: 700 },
    { month: "Aug", value: 680 },
    { month: "Sep", value: 730 },
    { month: "Oct", value: 800 },
    { month: "Nov", value: 850 },
    { month: "Dec", value: 900 },
  ],
  orders: [
    { month: "Jan", value: 50 },
    { month: "Feb", value: 65 },
    { month: "Mar", value: 70 },
    { month: "Apr", value: 90 },
    { month: "May", value: 100 },
    { month: "Jun", value: 95 },
    { month: "Jul", value: 105 },
    { month: "Aug", value: 110 },
    { month: "Sep", value: 115 },
    { month: "Oct", value: 120 },
    { month: "Nov", value: 125 },
    { month: "Dec", value: 130 },
  ],
  users: [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 25 },
    { month: "Mar", value: 30 },
    { month: "Apr", value: 40 },
    { month: "May", value: 45 },
    { month: "Jun", value: 50 },
    { month: "Jul", value: 55 },
    { month: "Aug", value: 60 },
    { month: "Sep", value: 65 },
    { month: "Oct", value: 70 },
    { month: "Nov", value: 75 },
    { month: "Dec", value: 80 },
  ],
  products: [
    {
      month: "Jan",
      Beer: 30,
      Wine: 20,
      Whiskey: 25,
      Vodka: 15,
      Gin: 10,
      Rum: 12,
    },
    {
      month: "Feb",
      Beer: 35,
      Wine: 25,
      Whiskey: 30,
      Vodka: 20,
      Gin: 12,
      Rum: 15,
    },
    {
      month: "Mar",
      Beer: 40,
      Wine: 28,
      Whiskey: 35,
      Vodka: 22,
      Gin: 15,
      Rum: 18,
    },
    {
      month: "Apr",
      Beer: 45,
      Wine: 32,
      Whiskey: 38,
      Vodka: 25,
      Gin: 18,
      Rum: 20,
    },
    {
      month: "May",
      Beer: 50,
      Wine: 35,
      Whiskey: 42,
      Vodka: 28,
      Gin: 20,
      Rum: 15,
    },
    {
      month: "Jun",
      Beer: 55,
      Wine: 38,
      Whiskey: 45,
      Vodka: 30,
      Gin: 32,
      Rum: 25,
    },
    {
      month: "Jul",
      Beer: 60,
      Wine: 40,
      Whiskey: 48,
      Vodka: 32,
      Gin: 15,
      Rum: 28,
    },
    {
      month: "Aug",
      Beer: 65,
      Wine: 42,
      Whiskey: 50,
      Vodka: 35,
      Gin: 28,
      Rum: 30,
    },
    {
      month: "Sep",
      Beer: 70,
      Wine: 45,
      Whiskey: 52,
      Vodka: 38,
      Gin: 30,
      Rum: 32,
    },
    {
      month: "Oct",
      Beer: 75,
      Wine: 48,
      Whiskey: 55,
      Vodka: 40,
      Gin: 32,
      Rum: 35,
    },
    {
      month: "Nov",
      Beer: 80,
      Wine: 50,
      Whiskey: 58,
      Vodka: 42,
      Gin: 35,
      Rum: 38,
    },
    {
      month: "Dec",
      Beer: 85,
      Wine: 52,
      Whiskey: 60,
      Vodka: 45,
      Gin: 38,
      Rum: 40,
    },
  ],
};

const Dashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState<
    "revenue" | "orders" | "users" | "products"
  >("revenue");
  return (
    <div className="flex flex-col gap-9 p-16 items-center">
      <DashboardOverview />
      <div className="p-16 flex flex-col gap-8 w-full">
        <h1 className="text-3xl font-semibold text-slate-700">Statistics</h1>
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
            <option value="products">Products</option>
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
              {selectedMetric === "products" ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="Beer"
                    stroke="brown"
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="Wine"
                    stroke="purple"
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="Whiskey"
                    stroke="red"
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="Gin"
                    stroke="black"
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="Rum"
                    stroke="#10b981"
                    strokeWidth={1}
                  />
                </>
              ) : (
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
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
