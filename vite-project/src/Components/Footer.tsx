import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdLiquor } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdMiscellaneousServices } from "react-icons/md";

type FooterProp = {
  size: string;
};

const Footer = (props: FooterProp) => {
  return (
    <section
      id="footer"
      className={`container mx-auto flex flex-col lg:p-2 p-4 ${
        props.size !== "sm" ? "lg:mt-64 mt-32 gap-24" : "gap-4"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between justify-center lg:items-center gap-10 w-full">
        <div className="flex lg:flex-col items-start flex-row gap-10 lg:w-[25%] w-full">
          <h2 className="text-3xl font-semibold">Spirits</h2>
          {props.size != "sm" && (
            <p className="text-gray-600 text-justify">
              The advantage of hiring a workspace with us is that givees you
              comfortable service and all-around facilities.
            </p>
          )}
        </div>
        <div id="Services" className="flex flex-col gap-4">
          <h3 className="text-[#F6973F] text-medium text-sm">
            Services <MdMiscellaneousServices className="inline ms-1" />
          </h3>
          {props.size != "sm" && (
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>Home Delivery</li>
              <li>Branding</li>
              <li>Campaigns</li>
            </ul>
          )}
        </div>
        <div id="Furniture" className="flex flex-col gap-4">
          <h3 className="text-[#F6973F] text-medium text-sm">
            Spirits <MdLiquor className="inline ms-1"></MdLiquor>
          </h3>
          {props.size != "sm" && (
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>Vodka</li>
              <li>Whiskey</li>
              <li>Beers</li>
            </ul>
          )}
        </div>
        <div id="Followus" className="flex flex-col gap-4">
          <h3 className="text-[#F6973F] text-medium text-sm">
            Follow us <RiCustomerService2Fill className="inline ms-1" />
          </h3>
          {props.size != "sm" && (
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>
                <FaFacebookSquare className="inline me-2" /> Facebook
              </li>
              <li>
                <FaXTwitter className="inline me-2" />
                Twitter
              </li>
              <li>
                <FaInstagram className="inline me-2" />
                Instagram
              </li>
            </ul>
          )}
        </div>
      </div>
      <div
        id="Copyright_section"
        className={`flex justify-between  ${
          props.size != "sm" ? "text-md text-gray-400" : "text-sm text-gray-700"
        }`}
      >
        <h6>Copyright &#169; 2021</h6>
        <div className="flex gap-5 ">
          <h6 className={`${props.size != "sm" ? "me-16" : ""}`}>
            Terms & Conditions
          </h6>
          <h6>Privacy Policy</h6>
        </div>
      </div>
    </section>
  );
};

export default Footer;
