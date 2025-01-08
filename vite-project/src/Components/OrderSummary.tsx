import axios from "axios";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { useEffect, useState } from "react";
type Product = {
  id: number;
  name: string;
  image_link: string;
  description: string;
  quantity: number;
  type_id: number;
  type_name: string;
  price: number;
};

const OrderSummary = () => {
  const { cartItems, cartQuantity } = useShoppingCart();
  const [shopItems, setShopItems] = useState<Product[]>([]);
  console.log("rendering the cart PAGEEEEE....");
  async function getProducts() {
    const { data } = await axios.get(`http://localhost:3000/api/products`);
    setShopItems(data);
  }
  const total = cartItems.reduce((acc, item) => {
    const product = shopItems.find((product) => product.id === item.id);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <section className="w-[25%] bg-slate-100 mt-12 rounded-2xl flex flex-col items-center p-10 gap-14">
      <h1 className="font-semibold text-3xl">Order Summary</h1>
      <hr className="w-full border-slate-800" />
      <h2 className="flex justify-between w-full font-medium text-xl">
        <span>Items : {cartQuantity}</span>
        <span>Total : {total}</span>
      </h2>
      <h2>Standard Delivery - Rs. {49}</h2>
      <hr className="w-full border-slate-800" />
      {total > 0 && (
        <h2 className="text-2xl font-bold">
          Total Cost : <span className="text-red-500">{total + 49}</span>
        </h2>
      )}
      <button className="w-full px-6 py-3 bg-blue-700 border border-blue-950 shadow-lg text-white text-lg font-medium">
        CHECKOUT
      </button>
    </section>
  );
};

export default OrderSummary;
