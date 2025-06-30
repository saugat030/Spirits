import { PiStarFill } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { ProductCardPropType } from "../types/home.types";

const Products = ({ imgSrc, name, price, id }: ProductCardPropType) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();
  function handleClick() {
    navigate(`/products/${id}`);
  }
  useEffect(() => {
    setImageLoaded(false);
  }, [id]);

  return (
    <section
      onClick={handleClick}
      className="h-[430px] transform w-[256px] duration-200 rounded-lg p-2 shadow-md shadow-slate-300 bg-gray-100 flex flex-col gap-5 cursor-pointer"
    >
      <figure className="text-center relative flex justify-center items-center">
        {!imageLoaded && (
          <div className="bg-slate-100 absolute h-full w-full flex justify-center items-center">
            <ClipLoader color="brown" size={60} />
          </div>
        )}
        <img
          src={imgSrc}
          alt=""
          className="h-[280px] w-full object-fill rounded-xl"
          onLoad={() => setImageLoaded(true)}
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
        <h5 className="text-[#0D1B39] text-2xl font-semibold">${price}</h5>
        <p>
          <FaCirclePlus className="text-3xl text-[#0D1B39]" />
        </p>
      </div>
    </section>
  );
};

export default Products;
