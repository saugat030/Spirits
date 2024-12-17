import { PiStarFill } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
type propType = {
  imgsrc: string;
  name: string;
};
const Products = ({ imgsrc, name }: propType) => {
  return (
    <section className="h-[430px] transform duration-200 w-64 rounded-lg p-2 shadow-md shadow-slate-300 bg-gray-100 flex flex-col gap-5 hover:scale-105">
      <figure>
        <img
          src={imgsrc}
          alt="JD"
          className="h-[280px] w-full object-fill rounded-xl"
        />
      </figure>
      <div>
        <h2 className="text-xl font-semibold mt-4 text-[#0D1B39]">{name}</h2>
        <div className="flex text-yellow-500">
          <PiStarFill />
          <PiStarFill />
          <PiStarFill />
          <PiStarFill />
          <PiStarFill />
        </div>
      </div>
      <div className="flex justify-between font-medium w-full text-lg">
        <h5 className="text-[#0D1B39]">400$</h5>
        <p>
          <FaCirclePlus className="text-3xl text-[#0D1B39]" />
        </p>
      </div>
    </section>
  );
};

export default Products;
