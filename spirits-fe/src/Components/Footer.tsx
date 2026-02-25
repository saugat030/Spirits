import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdLiquor } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdMiscellaneousServices } from "react-icons/md";

const Footer = () => {
  return (
    <section
      id="footer"
      className="container mx-auto flex flex-col lg:p-2 p-4 lg:mt-64 mt-32 gap-24"
    >
      {/* Main Footer Content */}
      <div className="flex flex-col lg:flex-row lg:justify-between justify-center lg:items-start gap-8 lg:gap-10 w-full">
        {/* Brand Section */}
        <div className="flex flex-col items-center lg:items-start gap-6 lg:w-[25%] w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <MdLiquor className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Spirits
            </h2>
          </div>
          <p className="text-gray-600 text-center lg:text-justify leading-relaxed">
            The advantage of hiring a workspace with us is that it gives you
            comfortable service and all-around facilities.
          </p>
        </div>

        {/* Mobile: Grid Layout for Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:flex lg:gap-16 w-full lg:w-auto">
          {/* Services Section */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-orange-500 font-semibold text-sm uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2">
              Services
              <MdMiscellaneousServices className="text-lg" />
            </h3>
            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer">
                Home Delivery
              </li>
              <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer">
                Branding
              </li>
              <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer">
                Campaigns
              </li>
            </ul>
          </div>

          {/* Products Section */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-orange-500 font-semibold text-sm uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2">
              Spirits
              <MdLiquor className="text-lg" />
            </h3>
            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer">
                Vodka
              </li>
              <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer">
                Whiskey
              </li>
              <li className="hover:text-orange-500 transition-colors duration-200 cursor-pointer">
                Beers
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h3 className="text-orange-500 font-semibold text-sm uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2">
              Follow us
              <RiCustomerService2Fill className="text-lg" />
            </h3>
            <ul className="flex flex-col gap-3 text-gray-600">
              <li className="hover:text-blue-600 transition-colors duration-200 cursor-pointer flex items-center justify-center lg:justify-start gap-2">
                <FaFacebookSquare className="text-lg" />
                Facebook
              </li>
              <li className="hover:text-black transition-colors duration-200 cursor-pointer flex items-center justify-center lg:justify-start gap-2">
                <FaXTwitter className="text-lg" />
                Twitter
              </li>
              <li className="hover:text-pink-600 transition-colors duration-200 cursor-pointer flex items-center justify-center lg:justify-start gap-2">
                <FaInstagram className="text-lg" />
                Instagram
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Copyright © 2025</span>
            <span className="text-orange-500 font-semibold">Spirits</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <button className="hover:text-orange-500 transition-colors duration-200">
              Terms & Conditions
            </button>
            <button className="hover:text-orange-500 transition-colors duration-200">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
