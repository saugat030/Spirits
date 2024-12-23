import { useEffect, useState } from "react";
import Products from "./Products";
import axios from "axios";

export type productType = {
  id: number;
  name: string;
  image_link: string;
  description: string;
  quantity: number;
  type_id: number;
  type_name: string;
  price: number;
};

const BestSelling = () => {
  const [products, setProducts] = useState<productType[]>([]);
  const [error, setError] = useState<string>("");
  const [alc, setAlc] = useState<string>("Whiskey");

  function changeValue() {
    setAlc("Vodka");
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products?type=${alc}`
      );
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [alc]);

  return (
    <div className="flex flex-col items-center gap-10 mt-20">
      <h1 className="text-4xl font-bold text-center w-full">Best Selling</h1>
      <div className="flex gap-0">
        <button
          onClick={changeValue}
          className="bg-amber-600 rounded-s-2xl px-2 py-1 border border-black text-white"
        >
          Vodka
        </button>
        <button
          onClick={changeValue}
          className="bg-amber-600  px-2 py-1 border border-t-black border-b-black text-white"
        >
          Whiskey
        </button>
        <button
          onClick={changeValue}
          className="bg-amber-600   px-2 py-1 border border-t-black border-b-black text-white"
        >
          Beer
        </button>
        <button
          onClick={changeValue}
          className="bg-amber-600 px-2 py-1 border border-t-black border-b-black text-white"
        >
          Rum
        </button>
        <button
          onClick={changeValue}
          className="bg-amber-600 rounded-e-2xl px-2 py-1 border border-black text-white"
        >
          Wine
        </button>
      </div>
      <div className="flex md:flex-row flex-col gap-20 md:h-full h-auto p-1">
        {error && (
          <Products imgsrc="" name="Product Not Found" price={0} id={NaN} />
        )}
        {products.slice(0, 4).map((item: productType) => {
          return (
            <Products
              imgsrc={item.image_link}
              name={item.name}
              price={item.price}
              id={item.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BestSelling;
