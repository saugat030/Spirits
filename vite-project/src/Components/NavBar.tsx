// import React from 'react'
import { HiShoppingCart } from "react-icons/hi";
import { FaAngleDown } from "react-icons/fa";
const NavBar = () => {
  return (
    <nav className="flex justify-between px-12  items-center text-white absolute z-30 w-full">
      <div className="font-bold text-3xl flex items-center h-24">Spirits</div>
      <ul className="flex font-semibold gap-10">
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
      <HiShoppingCart className="text-white text-3xl" />
    </nav>
  );
};

export default NavBar;
