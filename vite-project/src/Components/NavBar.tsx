import { HiShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../static/Logo.png";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
type NavType = {
  page: string;
};

const NavBar = (props: NavType) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }

  const { userData, setUserData, setIsLoggedin } = authContext;

  const navigate = useNavigate();

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post("http://localhost:3000/logout");
      data.success && setIsLoggedin(false);
      data.success && setUserData(null);
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  };
  function handleClick() {
    navigate("/login");
  }

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

      <div className="flex items-center gap-8">
        {userData ? (
          <div className="flex gap-5">
            <h1 className="rounded-full bg-white text-black p-2 font-bold text-lg hover:scale-90 duration-150 cursor-pointer">
              {userData.name}
            </h1>
            <button
              className="text-xl text-white font-semibold hover:underline hover:scale-105 duration-200"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleClick}
            className="text-xl text-white font-semibold hover:underline hover:scale-105 duration-200"
          >
            Login
          </button>
        )}
        <IoMenuSharp className="md:hidden text-3xl" />
        <button
          className="hover:bg-white  gap-2 hover:text-black rounded-full p-2 transition-all aspect-square text-4xl hidden md:flex items-center"
          onClick={() => {
            navigate("/cart");
          }}
        >
          <HiShoppingCart />
          <div>{1}</div>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
