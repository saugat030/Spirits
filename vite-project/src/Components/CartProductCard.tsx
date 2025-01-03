import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

const CartProductCard = () => {
  return (
    <section className="flex items-center gap-28 h-36 py-2 px-4 rounded-md bg-slate-100 mt-8">
      <figure className="h-full flex p-1 flex-1">
        <img
          src="https://ralphs.com.ph/cdn/shop/products/JACK_DANIELS_1000ml.png?v=1599097443"
          alt="JACK DANIELS"
          className="h-full"
        />
        <div className="flex flex-col justify-around items-start">
          <h3 className="font-semibold text-xl">Jack Daniels</h3>
          <h2 className="text-gray-600 text-md">Whiskey</h2>
          <button className="text-red-600">Remove</button>
        </div>
      </figure>
      <div className="flex items-center gap-3">
        <button className="hover:text-white hover:bg-green-900 rounded-full">
          <CiCirclePlus className="text-4xl" strokeWidth={1} />
        </button>
        <span className="text-2xl font-semibold mx-2">{4}</span>
        <button className="hover:text-white hover:bg-red-800 rounded-full">
          <CiCircleMinus className="text-4xl" strokeWidth={1} />
        </button>
      </div>
      <p id="Price_For_One" className="font-semibold text-xl">
        $ {200}
      </p>
      <p id="Price_For_Total" className="font-semibold text-2xl">
        $ {200 * 4}
      </p>
    </section>
  );
};

export default CartProductCard;
