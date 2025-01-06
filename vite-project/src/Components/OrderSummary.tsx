import { useShoppingCart } from "../Context/ShoppingCartContext";

const OrderSummary = () => {
  const { cartItems, cartQuantity } = useShoppingCart();

  return (
    <section className="w-[25%] bg-slate-100 mt-12 rounded-2xl flex flex-col items-center p-10 gap-14">
      <h1 className="font-semibold text-3xl">Order Summary</h1>
      <hr className="w-full border-slate-800" />
      <h2 className="flex justify-between w-full font-medium text-xl">
        <span>Items : {cartQuantity}</span>
        <span>Total : {}</span>
      </h2>
      <h2>Standard Delivery - Rs. {49}</h2>
      <hr className="w-full border-slate-800" />
      <h2>Total Cost : {}</h2>
      <button className="w-full px-6 py-3 bg-blue-700 border border-blue-950 shadow-lg text-white text-lg font-medium">
        CHECKOUT
      </button>
    </section>
  );
};

export default OrderSummary;
