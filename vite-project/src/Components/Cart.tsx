import CartProductCard from "./CartProductCard";

const Cart = () => {
  return (
    <div className="flex-1 mt-12 container mx-auto">
      <div className="flex justify-between w-full font-bold text-4xl">
        <h1>Shopping Cart</h1>
        <h1>3 Items</h1>
      </div>
      <hr className="my-8 border border-gray-400" />
      <div className="flex ps-4 w-full gap-32 text-lg text-gray-800">
        <h3 className="flex-1">Product Name</h3>
        <h3>Quantity</h3>
        <h3>Price</h3>
        <h3>Total Price</h3>
      </div>
      <CartProductCard />
      <CartProductCard />
      <CartProductCard />
    </div>
  );
};

export default Cart;
