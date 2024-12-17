// import React from 'react';

type NavType = {
  page: string;
};

import { HiShoppingCart } from "react-icons/hi";
import { IoMenuSharp } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";

const NavBar = (props: NavType) => {
  const navbarClass = props.page ? "home" : "bg-white";
  return (
    <nav className="flex overflow-hidden justify-between md:px-12 px-6  items-center text-white absolute z-30 w-full">
      <div className="font-bold md:text-3xl text-xl flex items-center h-24">
        Spirits
      </div>
      <ul className="md:flex hidden font-semibold gap-10">
        <li className="flex items-end gap-1 hover:text-gray-300 hover:scale-110 transition duration-200 cursor-pointer">
          Spirits
          <FaAngleDown className="text-white" />
        </li>
        <li className="hover:text-gray-300 hover:scale-110 transition duration-200 cursor-pointer">
          Shop
        </li>
        <li className="hover:text-gray-300 hover:scale-110 transition duration-200 cursor-pointer">
          About us
        </li>
        <li className="hover:text-gray-300 hover:scale-110 transition duration-200 cursor-pointer">
          Contact
        </li>
      </ul>
      <IoMenuSharp className="md:hidden text-3xl" />
      <HiShoppingCart className="text-white text-3xl hidden md:block" />
    </nav>
  );
};

export default NavBar;
