type NavType = {
  page: string;
};

import { HiShoppingCart } from "react-icons/hi";
import { IoMenuSharp } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const NavBar = (props: NavType) => {
  return (
    <nav
      className={`${
        props.page == "home" ? "absolute text-white" : "static text-black"
      } flex overflow-hidden justify-between md:px-12 px-6  items-center z-30 w-full`}
    >
      <div className="font-bold md:text-4xl text-2xl flex items-center h-24">
        Spirits
      </div>
      <ul className="md:flex hidden font-semibold text-xl gap-10">
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
