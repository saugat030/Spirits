import { useShoppingCart } from "../Context/ShoppingCartContext";
import CartProductCard from "./CartProductCard";

const Cart = () => {
  const { cartItems, cartQuantity } = useShoppingCart();

  return (
    <div className="flex-1 mt-12  px-14 mx-auto">
      <div className="flex justify-between w-full font-bold text-4xl">
        <h1>Shopping Cart</h1>
        <h1>{cartQuantity} Items</h1>
      </div>
      <hr className="my-8 border border-gray-400" />
      <div className="flex ps-4 w-full gap-32 text-lg text-gray-800">
        <h3 className="flex-1">Product Name</h3>
        <h3>Quantity</h3>
        <h3>Price</h3>
        <h3>Total Price</h3>
      </div>
      {cartItems.length > 0 ? (
        cartItems.map((item) => <CartProductCard key={item.id} {...item} />)
      ) : (
        <div className="text-4xl font-bold text-red-700 ms-14 mt-24">
          No Items in cart
        </div>
      )}
    </div>
  );
};

export default Cart;
