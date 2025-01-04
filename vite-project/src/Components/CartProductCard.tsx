import axios from "axios";
import { useEffect, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
type CartCardProps = {
  id: number;
  quantity: number;
};
const CartProductCard = ({ id, quantity }: CartCardProps) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [img_link, setImglink] = useState<string>("");
  async function getProducts() {
    const { data } = await axios.get(
      `http://localhost:3000/api/products/${id}`
    );
    console.log(data[0]);
    setName(data[0].name);
    setPrice(data[0].price);
    setCategory(data[0].type_name);
    setImglink(data[0].image_link);
  }
  useEffect(() => {
    getProducts();
  });
  return (
    <section className="flex items-center gap-28 h-36 py-2 px-4 rounded-md bg-slate-100 mt-8">
      <figure className="h-full flex p-1 flex-1">
        <img src={img_link} alt="JACK DANIELS" className="h-full" />
        <div className="flex flex-col justify-around items-start">
          <h3 className="font-semibold text-xl">{name}</h3>
          <h2 className="text-gray-600 text-md">{category}</h2>
          <button className="text-red-600">Remove</button>
        </div>
      </figure>
      <div className="flex items-center gap-3">
        <button className="hover:text-white hover:bg-green-900 rounded-full">
          <CiCirclePlus className="text-4xl" strokeWidth={1} />
        </button>
        <span className="text-2xl font-semibold mx-2">{quantity}</span>
        <button className="hover:text-white hover:bg-red-800 rounded-full">
          <CiCircleMinus className="text-4xl" strokeWidth={1} />
        </button>
      </div>
      <p id="Price_For_One" className="font-semibold text-xl">
        $ {price}
      </p>
      <p id="Price_For_Total" className="font-semibold text-2xl">
        $ {price * quantity}
      </p>
    </section>
  );
};

export default CartProductCard;
