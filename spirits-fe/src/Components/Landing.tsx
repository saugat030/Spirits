import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [searchKey, setSearchkey] = useState<string>("");
  const navigate = useNavigate();
  function handleClick() {
    //Even tho spacebar in the url is automatically handled better to use it for understanding
    navigate(`/products?name=${encodeURIComponent(searchKey)}`);
  }
  return (
    <>
      <div className="overflow-hidden bg-landingBg h-screen bg-no-repeat bg-center bg-cover text-white relative z-10 brightness-50"></div>
      <div className="absolute h-full w-full flex justify-center items-center top-0 z-20">
        <div className="text-white flex flex-col 2xl:gap-4 gap-4 xl:gap-2 2xl:mb-52">
          <h1 className="line-clamp-2 w-full xl:w-[60%] 2xl:w-1/2 text-center mx-auto font-bold xl:text-3xl 2xl:text-5xl text-lg 2xl:py-2 p-0">
            Drink because you are happy, but never because you are miserable.
          </h1>
          <p className="mx-auto md:block hidden w-[40%]  text-center 2xl:text-xl xl:text-lg text-gray-300">
            Drink moderately, for drunkenness neither keeps a secret, not
            observes a promise.
          </p>
          <div className="flex-col flex gap-16 justify-center items-center">
            <div
              className="flex items-center bg-gray-600/20 backdrop-blur-sm 2xl:pl-4 p-2 rounded-full lg:w-[400px] w-[370px] mx-auto border border-gray-400
           mt-6"
            >
              <input
                type="text"
                placeholder="Search Spirits"
                value={searchKey}
                onChange={(e) => {
                  setSearchkey(e.target.value);
                }}
                className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none pl-4"
              />
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full md:p-3 p-2 md:ml-2"
                onClick={handleClick}
              >
                <IoSearch />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Landing;
