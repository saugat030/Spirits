import  { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import classNames from "classnames";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import API from "../services/axiosInstance";
import { toast } from "react-hot-toast";
import { ADMIN_NAV_ITEMS } from "../constants/admin.constants";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { userData, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8f9fc] font-Poppins overflow-hidden p-4 gap-6 relative">
      {/* floating sidebar */}
      <aside
        className={classNames(
          "bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl transition-all duration-400 ease-in-out flex flex-col relative z-20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
          {
            "w-72": isSidebarOpen,
            "w-24": !isSidebarOpen,
          }
        )}
      >
        {/* logo */}
        <div className="h-24 flex items-center justify-center px-4">
          <div
            className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/")}
          >
            <img
              src="/static/Logo.png"
              alt="Logo"
              className={classNames("object-contain transition-all duration-400", {
                "h-12 mr-3": isSidebarOpen,
                "h-10 mx-auto": !isSidebarOpen,
              })}
            />
            <span
              className={classNames(
                "font-extrabold text-2xl tracking-tight text-slate-800 transition-all duration-400",
                {
                  "opacity-100 w-auto": isSidebarOpen,
                  "opacity-0 w-0 overflow-hidden": !isSidebarOpen,
                }
              )}
            >
              Spirits
            </span>
          </div>
        </div>

        {/* toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-12 bg-white border border-slate-100 rounded-full p-1.5 shadow-lg hover:shadow-xl text-slate-600 hover:text-orange-500 z-30 transition-all hover:scale-110 active:scale-95"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        {/* navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 mt-4 custom-scrollbar">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                classNames(
                  "flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden font-medium",
                  {
                    "text-white": isActive,
                    "text-slate-500 hover:text-white": !isActive,
                  }
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={classNames(
                      "absolute inset-y-0 left-0 transition-all duration-300 z-0",
                      {
                        "w-full bg-orange-500": isActive,
                        "w-0 group-hover:w-full bg-orange-300": !isActive,
                      }
                    )}
                  />
                  <div className="relative z-10 flex items-center w-full">
                    <item.icon
                      className={classNames("flex-shrink-0 w-5 h-5 transition-transform duration-300 group-hover:scale-110", {
                        "mr-4": isSidebarOpen,
                        "mx-auto": !isSidebarOpen,
                      })}
                    />
                    <span
                      className={classNames("whitespace-nowrap transition-opacity duration-300", {
                        "opacity-100": isSidebarOpen,
                        "opacity-0 hidden": !isSidebarOpen,
                      })}
                    >
                      {item.name}
                    </span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* logout part */}
        <div className="p-4 mt-auto mb-4">
          <div className={classNames("bg-slate-50 rounded-2xl p-3 border border-slate-100 transition-all duration-300", {
            "flex flex-col items-center justify-center": !isSidebarOpen
          })}>
            <div
              className={classNames("flex items-center gap-3", {
                "mb-4": isSidebarOpen,
                "mb-3": !isSidebarOpen
              })}
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400 overflow-hidden">
                <img src="/static/profile-placeholder.png" alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = ''; e.currentTarget.className = 'hidden'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                <UserIcon className="w-5 h-5 hidden" />
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {userData?.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{userData?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={classNames(
                "flex items-center justify-center w-full gap-2 p-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group",
                {
                  "text-red-500 hover:bg-red-50 hover:text-red-600": isSidebarOpen,
                  "text-red-400 hover:bg-red-50 hover:text-red-600": !isSidebarOpen,
                }
              )}
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* main content */}
      <main className="flex-1 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden flex flex-col z-10 relative">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
           <Outlet />
        </div>
      </main>
      
      {/* adding custom animations to document if not present (inline style for convenience or index.css) */}
      <style>{`
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(203, 213, 225, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(203, 213, 225, 0.8);
        }
      `}</style>
    </div>
  );
};
