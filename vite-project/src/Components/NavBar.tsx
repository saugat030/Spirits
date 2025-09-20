import { HiShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { NavType } from "../types/home.types";
import API from "../services/axiosInstance";
import { toast } from "react-toastify";
import { ApiResponse } from "../types/api.types";
import { DROPDOWN_CONSTANTS } from "../constants/homepage.constants";
import { HashLink } from "react-router-hash-link";

const NavBar = (props: NavType) => {
  const navigate = useNavigate();
  const { cartQuantity } = useShoppingCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [isSpiritsDropdownOpen, setIsSpiritsDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within AuthContextProvider");
  }
  const { userData, setUserData, setIsLoggedin } = authContext;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSpiritsDropdownOpen(false);
  }, [navigate]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await API.post<ApiResponse<undefined>>(`/auth/logout`);
      if (response.data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Logout failed"
      );
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsSpiritsDropdownOpen(false);
  };

  const toggleSpiritsDropdown = () => {
    setIsSpiritsDropdownOpen(!isSpiritsDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropDown(!profileDropDown);
  };

  const closeProfileDropdown = () => {
    setProfileDropDown(false);
  };

  const handleProfileNavigation = (path: string) => {
    navigate(path);
    closeProfileDropdown();
  };

  const handleLogout = () => {
    logout();
    closeProfileDropdown();
  };

  const isHomePage = props.page === "home";

  return (
    <>
      <nav
        className={`${
          isHomePage ? "absolute text-white" : "static text-black"
        } flex justify-between md:px-12 px-6 items-center z-30 w-full bg-transparent`}
      >
        {/* Logo */}
        <div className="font-bold md:text-3xl text-2xl flex items-center h-24">
          <img src="/static/Logo.png" alt="Logo" className="h-[80%] ms-2" />
          <Link to="/">Spirits</Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="md:flex hidden font-semibold text-xl gap-10 flex-1 justify-center">
          <li className="relative group">
            <div className="flex items-end gap-1 hover:text-gray-300 transition duration-200 cursor-pointer">
              <Link to="/">Spirits</Link>
              <FaAngleDown />
            </div>
            {/* Desktop Dropdown */}
            <div className="absolute top-full text-[16px] font-medium  left-0 mt-2 w-28 bg-slate-50 text-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-2">
                {DROPDOWN_CONSTANTS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.link}
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li className="hover:text-gray-300 transition duration-200 cursor-pointer">
            <Link to="/products">Shop</Link>
          </li>
          <li className="hover:text-gray-300 transition duration-200 cursor-pointer">
            <HashLink
              smooth
              to="/#About"
              scroll={(el) => {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              About
            </HashLink>
          </li>
          <li className="hover:text-gray-300 transition duration-200 cursor-pointer">
            <HashLink
              smooth
              to="/#footer"
              scroll={(el) => {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Contact
            </HashLink>
          </li>
        </ul>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-8">
          {userData ? (
            <div className="relative" ref={profileDropdownRef}>
              <div
                className="flex gap-1 items-center cursor-pointer"
                onClick={toggleProfileDropdown}
              >
                <div
                  className={`rounded-full ${
                    isHomePage ? "bg-white text-black " : "bg-black text-white "
                  } flex justify-center items-center font-bold text-lg hover:scale-95 duration-150 cursor-pointer h-[45px] w-[45px] p-2`}
                >
                  {userData.name.slice(0, 2)}
                </div>
                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    profileDropDown ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Profile Dropdown */}
              {profileDropDown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b text-sm text-gray-600 font-medium">
                      {userData.name}
                    </div>
                    <button
                      onClick={() => handleProfileNavigation("/orders")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => handleProfileNavigation("/cart")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      Cart
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`text-xl font-semibold hover:underline hover:scale-105 duration-200 ${
                isHomePage ? "text-white" : "text-black"
              }`}
            >
              Login
            </Link>
          )}

          <button
            className="hover:bg-white hover:text-black rounded-full p-2 transition-all aspect-square text-4xl flex items-center relative"
            onClick={() => navigate("/cart")}
            aria-label="Shopping cart"
          >
            <HiShoppingCart />
            {Number(cartQuantity) > 0 && (
              <div className="absolute -top-1 -right-1 text-sm text-white font-bold bg-red-600 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                {cartQuantity > 99 ? "99+" : cartQuantity}
              </div>
            )}
          </button>
        </div>

        {/* Mobile Menu Button & Cart */}
        <div className="md:hidden flex items-center gap-4">
          <button
            className="relative p-2"
            onClick={() => navigate("/cart")}
            aria-label="Shopping cart"
          >
            <HiShoppingCart className="text-3xl" />
            {cartQuantity && cartQuantity > 0 && (
              <div className="absolute -top-1 -right-1 text-sm text-white font-bold bg-red-600 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                {cartQuantity > 99 ? "99+" : cartQuantity}
              </div>
            )}
          </button>

          <button
            onClick={toggleMobileMenu}
            className="text-3xl p-2 hover:scale-110 transition-transform"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <IoClose /> : <IoMenuSharp />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="font-bold text-2xl text-black flex items-center">
              <img src="/static/Logo.png" alt="Logo" className="h-8 mr-2" />
              Spirits
            </div>
            <button
              onClick={closeMobileMenu}
              className="text-3xl text-black hover:scale-110 transition-transform"
              aria-label="Close menu"
            >
              <IoClose />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <ul className="flex flex-col font-semibold text-lg text-black">
              {/* Spirits with dropdown */}
              <li className="border-b">
                <button
                  onClick={toggleSpiritsDropdown}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <span>Spirits</span>
                  <FaAngleDown
                    className={`transition-transform duration-200 ${
                      isSpiritsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isSpiritsDropdownOpen && (
                  <div className="bg-gray-50 border-t">
                    {DROPDOWN_CONSTANTS.map((item) => (
                      <Link
                        key={item.label}
                        to={item.link}
                        className="w-full text-left p-4 pl-8 hover:bg-gray-100 transition-colors block"
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              <li className="border-b">
                <Link
                  to="/products"
                  onClick={closeMobileMenu}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors block"
                >
                  Shop
                </Link>
              </li>

              <li className="border-b">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    document
                      .getElementById("About")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                >
                  About
                </button>
              </li>

              <li className="border-b">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    document
                      .getElementById("footer")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Footer - Auth Section */}
          <div className="border-t p-6">
            {userData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-200 text-black px-4 py-2 font-bold">
                    {userData.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    className="w-full text-left text-lg font-semibold text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      navigate("/orders");
                      closeMobileMenu();
                    }}
                  >
                    My Orders
                  </button>
                  <button
                    className="w-full text-left text-lg font-semibold text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      navigate("/cart");
                      closeMobileMenu();
                    }}
                  >
                    Cart
                  </button>
                  <button
                    className="w-full text-left text-lg font-semibold text-red-600 hover:text-red-700"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="w-full text-left text-lg font-semibold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
