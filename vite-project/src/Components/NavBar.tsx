type NavType = {
  page: string;
};

import { HiShoppingCart } from "react-icons/hi";
import { IoMenuSharp } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../static/Logo.png";
const NavBar = (props: NavType) => {
  return (
    <nav
      className={`${
        props.page == "home" ? "absolute text-white" : "static text-black"
      } flex overflow-hidden justify-between md:px-12 px-6  items-center z-30 w-full`}
    >
      <div className="font-bold md:text-3xl text-2xl flex items-center h-24">
        <img src={Logo} alt="Logo" className="h-[80%] ms-2" />
        Jhyape
      </div>
      <ul className="md:flex hidden font-semibold text-xl gap-10 flex-1 justify-center">
        <li className="flex items-end gap-1 hover:text-gray-300 hover:scale-110 transition duration-200 cursor-pointer">
          <Link to="/">Spirits</Link>
          <FaAngleDown />
        </li>
        <li className="hover:text-gray-300 hover:scale-110 transition duration-200 cursor-pointer">
          <Link to="/products">Shop</Link>
        </li>
        <li className="hover:text-gray-300 hover:scale-110 transition duration-200 cursor-pointer">
          <a href="#About">About</a>
        </li>
        <li className="hover:text-gray-300 hover:scale-110 transition duration-200 cursor-pointer">
          <a href="#footer">Contact</a>
        </li>
      </ul>

      <IoMenuSharp className="md:hidden text-3xl" />

      <HiShoppingCart className="text-3xl hidden md:block" />
    </nav>
  );
};

export default NavBar;
