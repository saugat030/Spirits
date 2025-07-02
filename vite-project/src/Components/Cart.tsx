import { Package, ShoppingCart } from "lucide-react";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import CartProductCard from "./CartProductCard";
import { useQueries } from "@tanstack/react-query";
import { getProductById } from "../services/api/productsApi";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, cartQuantity } = useShoppingCart();
  console.log("Cart Items :", cartItems);
  const productQueries = useQueries({
    queries: cartItems.map((item) => ({
      queryKey: ["product", item.id],
      queryFn: () => getProductById(item.id.toString()),
    })),
  });

  const isLoadingAny = productQueries.some((q) => q.isLoading);
  const hasErrorAny = productQueries.some((q) => q.isError);

  const grandTotal = productQueries.reduce((accumulator, item, index) => {
    const price = item.data?.data?.price;
    const quantity = cartItems[index]?.quantity || 0;
    return price ? accumulator + price * quantity : accumulator;
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
              const productQuery = productQueries[index];
              const productData = productQuery?.data?.data;

              return (
                <div
                  key={item.id}
                  className={`transition-colors duration-200 hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <CartProductCard
                    id={item.id}
                    quantity={item.quantity}
                    product={productData}
                    isLoading={productQuery?.isLoading}
                    error={productQuery?.error}
                  />
                </div>
              );
            })}
          </div>

          {/* Cart Summary Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              {isLoadingAny ? (
                <div className="text-gray-500">Calculating total...</div>
              ) : hasErrorAny ? (
                <div className="text-red-500">Error loading prices.</div>
              ) : (
                <div className="text-lg text-gray-600 font-semibold">
                  Grand Total :{" "}
                  <span className="bg-slate-200 p-1 rounded-full text-base">
                    {" "}
                    NPR {grandTotal.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex gap-4">
                <Link to={"/products"}>
                  <button className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium">
                    Continue Shopping
                  </button>
                </Link>
                <button className="px-8 py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Proceed to Checkout
                </button>
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
