import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { FaUserShield, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../services/axiosInstance";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const userData = useAuthStore((state) => state.userData);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-Poppins">
      {/* Admin Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <FaUserShield className="text-yellow-500 w-6 h-6" />
              <span className="font-bold text-xl tracking-wider">SPIRITS ADMIN</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome, {userData?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 border border-gray-200">
          <div className="text-center">
            <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserShield className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to the Admin Dashboard</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You have successfully logged in with administrator privileges. Future administrative features like managing products, users, and orders will be accessible here.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Products</h3>
              <p className="text-gray-600 text-sm">Add, edit, or remove spirits from the catalog. (Coming soon)</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Users</h3>
              <p className="text-gray-600 text-sm">View user details, handle verifications and permissions. (Coming soon)</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 mb-2">View Orders</h3>
              <p className="text-gray-600 text-sm">Track customer orders, manage shipping and fulfillment. (Coming soon)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;