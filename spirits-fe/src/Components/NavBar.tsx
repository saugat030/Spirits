import { HiShoppingCart } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { useCartStore } from "../store/useCartStore";
import API from "../services/axiosInstance";
import { toast } from "react-toastify";
import { ApiResponse } from "../types/api.types";
import { DROPDOWN_CONSTANTS } from "../constants/homepage.constants";
import { HashLink } from "react-router-hash-link";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.cartItems);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [isSpiritsDropdownOpen, setIsSpiritsDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const userData = useAuthStore((state) => state.userData);
  const setProfileData = useAuthStore((state) => state.setProfileData);
  const setIsLoggedin = useAuthStore((state) => state.setIsLoggedin);
  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0,
  );

  // Determine if we are on the home page based on URL
  const isHomePage = location.pathname === "/";

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
        setProfileData(null);
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Logout failed",
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

  return (
    <>
      <nav
        className={`${
          isHomePage
            ? "absolute text-white bg-gradient-to-b from-black/50 to-transparent"
            : "sticky top-0 bg-white/90 backdrop-blur-md text-slate-800 border-b border-slate-100 shadow-sm"
        } flex justify-between md:px-10 px-6 items-center z-40 w-full py-3`}
      >
        {/* Logo */}
        <div className="font-bold text-2xl flex items-center cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => navigate("/")}>
          <img src="/static/Logo.png" alt="Logo" className="h-10 mr-2 object-contain" />
          <span className="tracking-tight">Spirits</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="md:flex hidden font-medium text-[15px] gap-8 flex-1 justify-center items-center">
          <li className="relative group">
            <div className="flex items-center gap-1.5 hover:text-orange-500 transition-colors duration-200 cursor-pointer py-2">
              <Link to="/">Spirits</Link>
              <FaAngleDown className="text-[10px] transition-transform duration-300 group-hover:rotate-180" />
            </div>
            {/* Desktop Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="w-52 bg-white/95 backdrop-blur-md text-slate-800 rounded-2xl shadow-xl border border-slate-100 py-2 flex flex-col transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {DROPDOWN_CONSTANTS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.link}
                    className="px-5 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-orange-500 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left py-2">
            <Link to="/products">Shop</Link>
          </li>
          <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-orange-500 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left py-2">
            <HashLink smooth to="/#About" scroll={(el) => { el.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
              About
            </HashLink>
          </li>
          <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-orange-500 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left py-2">
            <HashLink smooth to="/#footer" scroll={(el) => { el.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
              Contact
            </HashLink>
          </li>
        </ul>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-6">
          {userData ? (
            <div className="relative" ref={profileDropdownRef}>
              <div
                className="flex gap-2 items-center cursor-pointer group"
                onClick={toggleProfileDropdown}
              >
                <div className="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-orange-500 transition-all duration-300 overflow-hidden shadow-sm bg-slate-100">
                  <img src="/static/profile-placeholder.png" alt={userData.name} className="w-full h-full object-cover" />
                </div>
                <FaAngleDown
                  className={`text-[11px] transition-transform duration-300 ${
                    profileDropDown ? "rotate-180 text-orange-500" : ""
                  } group-hover:text-orange-500`}
                />
              </div>

              {/* Profile Dropdown */}
              <div className={`absolute top-full right-0 pt-3 transition-all duration-300 z-50 ${profileDropDown ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="w-60 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-bold truncate text-slate-900">{userData.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{userData.email}</p>
                  </div>
                  <div className="py-2 flex flex-col">
                    {userData.role === "admin" ? (
                      <button onClick={() => handleProfileNavigation("/admin")} className="text-left px-5 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors text-sm font-medium">Admin Dashboard</button>
                    ) : (
                      <button onClick={() => handleProfileNavigation("/profile")} className="text-left px-5 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors text-sm font-medium">My Profile</button>
                    )}
                    <button onClick={() => handleProfileNavigation("/orders")} className="text-left px-5 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors text-sm font-medium">My Orders</button>
                    <div className="h-px bg-slate-100 my-2 w-full" />
                    <button onClick={handleLogout} className="text-left px-5 py-2.5 hover:bg-red-50 text-red-600 transition-colors text-sm font-medium">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className={`text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                isHomePage ? "bg-white text-black hover:bg-slate-100" : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Log in
            </Link>
          )}

          <button
            className={`relative p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${isHomePage ? "hover:bg-white/20 backdrop-blur-sm" : "hover:bg-orange-50 text-slate-700 hover:text-orange-600"}`}
            onClick={() => navigate("/cart")}
            aria-label="Shopping cart"
          >
            <HiShoppingCart className="text-2xl" />
            {Number(cartQuantity) > 0 && (
              <div className={`absolute top-0 right-0 text-[10px] text-white font-bold bg-orange-500 rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 shadow-sm transform translate-x-1/4 -translate-y-1/4 ${isHomePage ? "border-black" : "border-white"}`}>
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
            <HiShoppingCart className="text-[26px]" />
            {cartQuantity > 0 && (
              <div className={`absolute top-0 right-0 text-[10px] text-white font-bold bg-orange-500 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 shadow-sm transform translate-x-1/4 -translate-y-1/4 ${isHomePage ? "border-black" : "border-white"}`}>
                {cartQuantity > 99 ? "99+" : cartQuantity}
              </div>
            )}
          </button>

          <button
            onClick={toggleMobileMenu}
            className="text-[28px] p-1.5 hover:scale-110 transition-transform"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <IoClose /> : <IoMenuSharp />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div className="font-bold text-2xl text-slate-900 flex items-center">
            <img src="/static/Logo.png" alt="Logo" className="h-8 mr-2 object-contain" />
            <span className="tracking-tight">Spirits</span>
          </div>
          <button
            onClick={closeMobileMenu}
            className="text-2xl text-slate-500 hover:text-orange-500 hover:scale-110 transition-all bg-slate-50 p-2 rounded-full"
            aria-label="Close menu"
          >
            <IoClose />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col font-medium text-base text-slate-800 px-4 space-y-1">
            <li>
              <button
                onClick={toggleSpiritsDropdown}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isSpiritsDropdownOpen ? "bg-orange-50 text-orange-600" : "hover:bg-slate-50"}`}
              >
                <span>Spirits</span>
                <FaAngleDown
                  className={`transition-transform duration-300 ${
                    isSpiritsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSpiritsDropdownOpen ? "max-h-[400px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                <div className="bg-slate-50 rounded-xl py-2 mx-2">
                  {DROPDOWN_CONSTANTS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.link}
                      className="w-full text-left py-3 px-6 hover:bg-orange-100/50 hover:text-orange-600 transition-colors block text-sm font-medium rounded-lg mx-2"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            <li>
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="w-full flex p-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Shop
              </Link>
            </li>

            <li>
              <button
                onClick={() => {
                  closeMobileMenu();
                  document.getElementById("About")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full text-left p-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                About
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  closeMobileMenu();
                  document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full text-left p-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Footer - Auth Section */}
        <div className="border-t border-slate-100 p-6 bg-slate-50/50">
          {userData ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-sm bg-slate-100 flex-shrink-0">
                  <img src="/static/profile-placeholder.png" alt={userData.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 truncate">{userData.name}</div>
                  <div className="text-xs text-slate-500 truncate">{userData.email}</div>
                </div>
              </div>
              <div className="space-y-1.5 flex flex-col px-1">
                {userData.role === "admin" ? (
                  <button className="w-full text-left py-3 px-4 rounded-xl font-semibold text-slate-700 hover:bg-orange-100/50 hover:text-orange-600 transition-colors text-sm" onClick={() => { navigate("/admin"); closeMobileMenu(); }}>Admin Dashboard</button>
                ) : (
                  <button className="w-full text-left py-3 px-4 rounded-xl font-semibold text-slate-700 hover:bg-orange-100/50 hover:text-orange-600 transition-colors text-sm" onClick={() => { navigate("/profile"); closeMobileMenu(); }}>My Profile</button>
                )}
                <button className="w-full text-left py-3 px-4 rounded-xl font-semibold text-slate-700 hover:bg-orange-100/50 hover:text-orange-600 transition-colors text-sm" onClick={() => { navigate("/orders"); closeMobileMenu(); }}>My Orders</button>
                <button className="w-full text-left py-3 px-4 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors text-sm mt-2" onClick={() => { logout(); closeMobileMenu(); }}>Logout</button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="w-full flex justify-center py-3.5 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
