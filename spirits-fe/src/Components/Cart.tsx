import { Package, ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import CartProductCard from "./CartProductCard";
import { Link } from "react-router-dom";

const Cart = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);
  const grandTotal = cartItems.reduce((accumulator, item) => {
    const selectedVariant = item.product.variants.find(
      (v) => v.id === item.selectedVariantId
    );
    const price = selectedVariant?.discountedPrice || item.product.minDiscountedPrice;
    return accumulator + price * item.quantity;
  }, 0);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center lg:gap-16 justify-between lg:mb-4 mb-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <Package className="w-5 h-5 text-amber-600" />
            <span className="text-lg font-semibold text-amber-800">
              {cartQuantity} {cartQuantity === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-amber-600 to-red-900 rounded-full"></div>
      </div>

      {cartItems.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">
              <div className="col-span-6 lg:col-span-5">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Total</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {cartItems.map((item, index) => {
              return (
                <div
                  key={item.selectedVariantId}
                  className={`transition-colors duration-200 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <CartProductCard
                    quantity={item.quantity}
                    product={item.product}
                    selectedVariantId={item.selectedVariantId}
                  />
                </div>
              );
            })}
          </div>

          {/* Cart Summary Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-lg text-gray-600 font-semibold">
                Grand Total :{" "}
                <span className="bg-slate-200 p-1 rounded-full text-base">
                  {" "}
                  NPR {grandTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-4">
                <Link to={"/products"}>
                  <button className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium">
                    Continue Shopping
                  </button>
                </Link>
                <Link to={"/checkout"}>
                  <button className="px-8 py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-lg hover:from-amber-700 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Empty Cart State
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start
            shopping to fill it up!
          </p>
          <Link to={"/products"}>
            <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Start Shopping
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
