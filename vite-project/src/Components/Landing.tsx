// import img from "../static/landingBg.jpg";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [searchKey, setSearchkey] = useState<string>("");
  const navigate = useNavigate();
  function handleClick() {
    navigate(`/products?name=${searchKey}`);
  }
  return (
    <>
      <div className="overflow-hidden bg-landingBg h-screen bg-no-repeat bg-center bg-cover text-white relative z-10 brightness-50"></div>
      <div className="absolute h-full w-full flex justify-center items-center top-0 z-20">
        <div className="text-white flex flex-col gap-4 mb-52">
          <h1 className="line-clamp-2 w-full md:w-1/2 text-center mx-auto font-bold md:text-5xl text-lg md:py-2 p-0">
            Drink because you are happy, but never because you are miserable.
          </h1>
          <p className="mx-auto md:block hidden md:w-1/3 w-0  text-center text-xl">
            Drink moderately, for drunkenness neither keeps a secret, not
            observes a promise.
          </p>
          <div className="flex-col flex gap-16 justify-center items-center">
            <div
              className="flex items-center bg-gray-600/20 backdrop-blur-sm md:pl-4 p-2 rounded-full md:w-[400px] w-[350px] mx-auto border hover:scale-105 duration-200 border-gray-400
           mt-6"
            >
              <input
                type="text"
                placeholder="Search Spirits"
                value={searchKey}
                onChange={(e) => {
                  setSearchkey(e.target.value);
                }}
                className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none"
              />
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full md:p-3 p-2 md:ml-2"
                onClick={handleClick}
              >
                <IoSearch />
              </button>
            </div>
            <button className="px-3 py-2 text-lg text-white bg-orange-500 opacity-90 rounded-2xl md:hidden">
              Find what matches your taste
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Landing;
