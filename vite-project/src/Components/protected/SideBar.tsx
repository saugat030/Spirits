import { FaRegFolderOpen } from "react-icons/fa";
import { IoCalendarClearOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const navItems = [
    {
      name: "Dashboard",
      to: "/admin",
      icon: <MdOutlineDashboard size={20} />,
    },
    {
      name: "Users",
      to: "/admin/users",
      icon: <LuUsersRound size={20} />,
    },
    {
      name: "Orders",
      to: "/admin/orders",
      icon: <IoCalendarClearOutline size={20} />,
    },
    {
      name: "Products",
      to: "/admin/products",
      icon: <FaRegFolderOpen size={20} />,
    },
    {
      name: "Settings",
      to: "/admin/settings",
      icon: <IoSettingsOutline size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-[#060606] border-r px-6 py-8 flex flex-col gap-8">
      <div className="text-2xl text-white font-bold">Spirits</div>
      <nav className="flex flex-col gap-6 text-[#F1F1F1]">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 hover:text-orange-300 font-semibold ${
                isActive ? "text-orange-500 font-bold" : "text-[#F1F1F1]"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
