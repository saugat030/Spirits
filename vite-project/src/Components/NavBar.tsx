// import React from 'react'
import { HiShoppingCart } from "react-icons/hi";
import { FaAngleDown } from "react-icons/fa";
const NavBar = () => {
  return (
    <nav className="flex justify-between px-12  items-center text-white absolute z-20 w-full">
      <div className="font-bold text-3xl flex items-center h-24">Spirits</div>
      <ul className="flex font-semibold gap-10">
        <li className="flex items-end gap-1">
          Spirits
          <FaAngleDown className="text-white" />
        </li>
        <li>Shop</li>
        <li>About us</li>
        <li>Contact</li>
      </ul>
      <HiShoppingCart className="text-white text-3xl" />
    </nav>
  );
};

export default NavBar;
