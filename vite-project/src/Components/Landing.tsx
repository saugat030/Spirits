// import img from "../static/landingBg.jpg";
import { IoSearch } from "react-icons/io5";
const Landing = () => {
  return (
    <>
      <div className="bg-[url('src/static/landingBg.jpg')] h-screen bg-no-repeat bg-center bg-cover text-white relative z-10 brightness-50"></div>
      <div className="absolute h-full w-full flex justify-center items-center top-0 z-20">
        <div className="text-white flex flex-col gap-4 mb-52">
          <h1 className="line-clamp-2 w-1/2 text-center mx-auto font-bold text-5xl py-2">
            Drink because you are happy, but never because you are miserable.
          </h1>
          <p className="mx-auto w-1/3 text-center text-xl">
            Drink moderately, for drunkenness neither keeps a secret, nor
            observes a promise.
          </p>
          <div
            className="flex items-center bg-gray-600/20 backdrop-blur-sm pl-4 p-2 rounded-full w-[400px] mx-auto border hover:scale-105 duration-200 border-gray-400
           mt-6"
          >
            <input
              type="text"
              placeholder="Search Spirits"
              className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 ml-2">
              <IoSearch />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Landing;
